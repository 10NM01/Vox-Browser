
# --- Multi-page wizard installer ---
import os
import subprocess
import sys
import threading
import tkinter as tk
from tkinter import ttk, messagebox

VOX_LOGO = 'Vox'

MODELS = [
    ("No AI assistant (skip all AI setup)", None, None),
    ("TinyLlama-1.1B-Chat (0.5GB RAM, 0.5GB disk)",
     "https://huggingface.co/TinyLlama/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf",
     "tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf"),
    ("Phi-2 2.7B (1.5GB RAM, 2GB disk)",
     "https://huggingface.co/microsoft/phi-2-GGUF/resolve/main/phi-2.Q4_K_M.gguf",
     "phi-2.Q4_K_M.gguf"),
    ("Mistral-7B-Instruct (4GB RAM, 4GB disk)",
     "https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.2-GGUF/resolve/main/mistral-7b-instruct-v0.2.Q4_K_M.gguf",
     "mistral-7b-instruct-v0.2.Q4_K_M.gguf"),
    ("Custom GGUF model (enter URL)", "CUSTOM", "custom_model.gguf")
]

class VoxInstaller(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Vox Browser Installer")
        self.geometry("540x420")
        self.resizable(False, False)
        self.selected_model = tk.IntVar(value=1)
        self.custom_url = tk.StringVar()
        self.custom_file = tk.StringVar()
        self.tab_layout = tk.StringVar(value="vertical")
        self.theme = tk.StringVar(value="dark")
        self.search = tk.StringVar(value="duckduckgo")
        self.status = tk.StringVar(value="Ready.")
        self.accept_terms = tk.BooleanVar()
        self.page = 0
        self.pages = []
        self.create_pages()
        self.show_page(0)

    def create_pages(self):
        # Page 0: Welcome & Terms
        frame0 = tk.Frame(self, bg="#fff")
        tk.Label(frame0, text=VOX_LOGO, font=("Consolas", 16, "bold"), fg="#000", bg="#fff").pack(pady=(10,0))
        tk.Label(frame0, text="Vox Browser Installer", font=("Segoe UI", 18, "bold"), bg="#fff").pack(pady=(0,10))
        tk.Label(frame0, text="By installing Vox, you agree to:\n- Use open-source LLMs for local inference only\n- Accept that large models require significant disk and RAM\n- No data is sent to any cloud by default\n- You are responsible for your own privacy and compliance", justify="left", bg="#fff").pack(pady=(0,10))
        tk.Checkbutton(frame0, text="I accept the terms and conditions", variable=self.accept_terms, bg="#fff").pack()
        self.pages.append(frame0)

        # Page 1: Model selection
        frame1 = tk.Frame(self, bg="#fff")
        tk.Label(frame1, text="Choose your local AI model:", font=("Segoe UI", 14, "bold"), bg="#fff").pack(pady=(10,5))
        for i, (label, _, _) in enumerate(MODELS):
            tk.Radiobutton(frame1, text=label, variable=self.selected_model, value=i, command=self.toggle_custom, bg="#fff").pack(anchor="w")
        self.custom_url_entry = tk.Entry(frame1, textvariable=self.custom_url, width=50, state=tk.DISABLED)
        self.custom_file_entry = tk.Entry(frame1, textvariable=self.custom_file, width=30, state=tk.DISABLED)
        tk.Label(frame1, text="Custom model URL:", bg="#fff").pack(anchor="w", padx=20)
        self.custom_url_entry.pack(anchor="w", padx=20)
        tk.Label(frame1, text="Custom filename:", bg="#fff").pack(anchor="w", padx=20)
        self.custom_file_entry.pack(anchor="w", padx=20)
        self.pages.append(frame1)

        # Page 2: Browser preferences
        frame2 = tk.Frame(self, bg="#fff")
        tk.Label(frame2, text="Browser Preferences:", font=("Segoe UI", 14, "bold"), bg="#fff").pack(pady=(10,5))
        prefs = tk.Frame(frame2, bg="#fff")
        prefs.pack(pady=10)
        ttk.Label(prefs, text="Tab layout:").grid(row=0, column=0, sticky="w")
        ttk.Combobox(prefs, textvariable=self.tab_layout, values=["vertical", "horizontal"], width=12).grid(row=0, column=1)
        ttk.Label(prefs, text="Theme:").grid(row=1, column=0, sticky="w")
        ttk.Combobox(prefs, textvariable=self.theme, values=["dark", "light"], width=12).grid(row=1, column=1)
        ttk.Label(prefs, text="Search engine:").grid(row=2, column=0, sticky="w")
        ttk.Combobox(prefs, textvariable=self.search, values=["duckduckgo", "startpage", "brave"], width=12).grid(row=2, column=1)
        self.pages.append(frame2)

        # Page 3: Install & status
        frame3 = tk.Frame(self, bg="#fff")
        tk.Label(frame3, text="Ready to install Vox Browser!", font=("Segoe UI", 14, "bold"), bg="#fff").pack(pady=(10,5))
        tk.Label(frame3, text="Click Install to begin. This may take several minutes.\n\nYou can start the local AI server after install:", bg="#fff").pack()
        tk.Label(frame3, text="cd llama.cpp/api && python3 vox_llm_api.py", font=("Consolas", 10), bg="#fff").pack(pady=(0,10))
        self.status_label = tk.Label(frame3, textvariable=self.status, fg="#888", bg="#fff")
        self.status_label.pack(pady=(10,0))
        self.install_btn = tk.Button(frame3, text="Install Vox", font=("Segoe UI", 14, "bold"), bg="#a259ff", fg="#fff", command=self.start_install)
        self.install_btn.pack(pady=10)
        self.pages.append(frame3)

    def show_page(self, idx):
        for p in self.pages:
            p.pack_forget()
        self.pages[idx].pack(fill="both", expand=True)
        self.page = idx
        self.update_nav()

    def update_nav(self):
        # Remove old nav if any
        if hasattr(self, 'nav_frame'):
            self.nav_frame.destroy()
        self.nav_frame = tk.Frame(self, bg="#fff")
        self.nav_frame.pack(side="bottom", fill="x")
        if self.page > 0:
            tk.Button(self.nav_frame, text="Back", command=lambda: self.show_page(self.page-1)).pack(side="left", padx=10, pady=8)
        if self.page < len(self.pages)-1:
            tk.Button(self.nav_frame, text="Next", command=self.next_page).pack(side="right", padx=10, pady=8)

    def next_page(self):
        if self.page == 0 and not self.accept_terms.get():
            messagebox.showerror("Terms Required", "You must accept the terms to continue.")
            return
        if self.page == 1:
            self.toggle_custom()
        self.show_page(self.page+1)

    def toggle_custom(self):
        idx = self.selected_model.get()
        state = tk.NORMAL if MODELS[idx][1] == "CUSTOM" else tk.DISABLED
        self.custom_url_entry.config(state=state)
        self.custom_file_entry.config(state=state)

    def start_install(self):
        self.install_btn.config(state=tk.DISABLED)
        threading.Thread(target=self.do_install, daemon=True).start()


    def do_install(self):
        self.status.set("Installing dependencies...")
        self.status_label.update()
        subprocess.run(["sudo", "apt-get", "update"])
        subprocess.run([
            "sudo", "apt-get", "install", "-y",
            "git", "build-essential", "python3", "python3-pip", "curl", "cmake", "libcurl4-openssl-dev", "python3-tk"
        ])
        idx = self.selected_model.get()
        model_url, model_file = MODELS[idx][1], MODELS[idx][2]
        if model_url == "CUSTOM":
            model_url = self.custom_url.get().strip()
            model_file = self.custom_file.get().strip() or "custom_model.gguf"
        if model_url and model_url != "NOAI":
            self.status.set("Cloning llama.cpp...")
            self.status_label.update()
            if not os.path.isdir("llama.cpp"):
                subprocess.run(["git", "clone", "https://github.com/ggerganov/llama.cpp.git"])
            os.makedirs("llama.cpp/build", exist_ok=True)
            self.status.set("Building llama.cpp (CMake)...")
            self.status_label.update()
            subprocess.run(["cmake", ".."], cwd="llama.cpp/build")
            subprocess.run(["cmake", "--build", ".", "--config", "Release", "-j", str(os.cpu_count())], cwd="llama.cpp/build")
            self.status.set(f"Downloading model: {model_file}...")
            self.status_label.update()
            os.makedirs("llama.cpp/models", exist_ok=True)
            subprocess.run(["curl", "-L", model_url, "-o", f"llama.cpp/models/{model_file}"])
            self.status.set("Setting up LLM API...")
            self.status_label.update()
            os.makedirs("llama.cpp/api", exist_ok=True)
            with open("llama.cpp/api/vox_llm_api.py", "w") as f:
                f.write(f"""from flask import Flask, request, jsonify\nimport subprocess\nimport os\n\napp = Flask(__name__)\nMODEL_PATH = os.path.abspath('../models/{model_file}')\nLLAMA_BIN = os.path.abspath('../build/main')\n\n@app.route('/api/llm', methods=['POST'])\ndef llm():\n    prompt = request.json.get('prompt', '')\n    if not prompt:\n        return jsonify({{'error': 'No prompt'}}), 400\n    proc = subprocess.Popen([\n        LLAMA_BIN, '-m', MODEL_PATH, '-p', prompt, '-n', '128', '--temp', '0.7', '--top_k', '40', '--top_p', '0.95', '--repeat_penalty', '1.1', '--color', 'never', '--silent-prompt'\n    ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)\n    out, err = proc.communicate(timeout=60)\n    if proc.returncode != 0:\n        return jsonify({{'error': err.decode()}}), 500\n    return jsonify({{'response': out.decode().strip()}})\n\nif __name__ == '__main__':\n    app.run(host='127.0.0.1', port=8088)\n""")
            subprocess.run(["pip3", "install", "flask"])
        # Write user.js
        self.status.set("Writing browser preferences...")
        self.status_label.update()
        userjs_dir = "firefox-115.0/browser/app/profile"
        os.makedirs(userjs_dir, exist_ok=True)
        search_map = {"duckduckgo": "https://duckduckgo.com/?q=", "startpage": "https://www.startpage.com/do/dsearch?query=", "brave": "https://search.brave.com/search?q="}
        with open(os.path.join(userjs_dir, "user.js"), "w") as f:
            f.write(f'user_pref("toolkit.legacyUserProfileCustomizations.stylesheets", true);\n')
            f.write(f'user_pref("userChrome.vox-tab-layout", "{self.tab_layout.get()}");\n')
            f.write(f'user_pref("userChrome.vox-theme", "{self.theme.get()}");\n')
            f.write(f'user_pref("browser.startup.homepage", "file://{os.path.abspath("firefox-115.0/browser/app/profile/defaults/vox_start.html")}");\n')
            f.write(f'user_pref("browser.search.defaultenginename", "{search_map[self.search.get()]}");\n')
        self.status.set("Vox Browser is ready!\nYou can start the local AI server with:\n  cd llama.cpp/api && python3 vox_llm_api.py\nThen launch the browser.")
        self.status_label.update()
        messagebox.showinfo("Vox Installer", "Vox Browser is ready!\n\nYou can start the local AI server with:\n  cd llama.cpp/api && python3 vox_llm_api.py\nThen launch the browser.")
        self.quit()

if __name__ == "__main__":
    app = VoxInstaller()
    app.mainloop()
