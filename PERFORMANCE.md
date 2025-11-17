# Vox Browser Performance Guide

## Overview

Vox Browser is optimized to run smoothly on a wide range of systems, from high-end workstations to old/slow hardware. The browser automatically detects your system capabilities and applies appropriate optimizations.

## Automatic Optimizations

### System Detection

The browser automatically detects:
- **Total RAM**: Determines if system is low-end
- **CPU Cores**: Identifies single-core systems
- **Platform**: Applies platform-specific optimizations

### Optimization Levels

#### Very Low-End Systems (< 2GB RAM or 1 CPU core)
- ✅ Hardware acceleration disabled (if causing issues)
- ✅ Lazy loading enabled for all images
- ✅ Concurrent requests limited to 2
- ✅ Animations disabled
- ✅ Automatic cache clearing every 5 minutes
- ✅ Reduced window size (1200x800)
- ✅ Background throttling disabled
- ✅ Spellcheck disabled

#### Low-End Systems (< 4GB RAM or < 2 CPU cores)
- ✅ Lazy loading enabled
- ✅ Image optimization enabled
- ✅ Concurrent requests limited to 4
- ✅ Periodic cache management
- ✅ Standard window size

#### Standard Systems (4GB+ RAM, 2+ cores)
- ✅ Full performance features
- ✅ No artificial limitations
- ✅ Hardware acceleration enabled
- ✅ All features available

## Manual Performance Tuning

### For Slow Systems

1. **Choose Lightweight AI Models**
   - Use TinyLlama 1.1B or Phi-2 Mini
   - Avoid large models (70B, etc.)

2. **Limit Open Tabs**
   - Keep fewer than 5 tabs open
   - Close unused tabs regularly

3. **Disable Unnecessary Features**
   - Turn off Interactive Mode if not needed
   - Disable Tor if not required
   - Use Dark Mode (uses less power on OLED)

4. **Clear Cache Regularly**
   - Settings → Privacy → Clear Cache
   - Or use keyboard shortcut

### For Fast Systems

1. **Enable All Features**
   - Use larger AI models
   - Enable all security features
   - Use multiple tabs freely

2. **Hardware Acceleration**
   - Enabled by default
   - Disable only if experiencing issues

## Performance Metrics

### Memory Usage
- **Idle**: ~200-300 MB
- **With 5 tabs**: ~400-600 MB
- **With AI model loaded**: +500 MB to +2 GB (depending on model)

### CPU Usage
- **Idle**: < 1%
- **Browsing**: 5-15%
- **With AI active**: 20-40% (depending on model)

### Startup Time
- **Cold start**: 2-4 seconds
- **Warm start**: < 1 second

## Troubleshooting Performance Issues

### Browser is Slow

1. **Check System Resources**
   ```bash
   # Linux
   htop
   # or
   free -h
   ```

2. **Close Unused Tabs**
   - Each tab uses memory
   - Close tabs you're not using

3. **Clear Cache**
   - Settings → Privacy → Clear Cache
   - Or restart browser

4. **Disable Extensions**
   - Some extensions can slow down browser
   - Disable if not needed

5. **Check vGuard Stats**
   - Open vGuard dashboard
   - High blocking counts may indicate issues
   - Reset stats if needed

### High Memory Usage

1. **Close Tabs**
   - Most common cause
   - Each tab uses 50-200 MB

2. **Clear Cache**
   - Settings → Privacy → Clear Cache
   - Clears temporary files

3. **Restart Browser**
   - Clears all memory
   - Fresh start

4. **Check AI Model**
   - Large models use more memory
   - Switch to smaller model if needed

### Slow Page Loading

1. **Check Internet Connection**
   - Slow connection = slow loading
   - Test with: `ping google.com`

2. **Disable vGuard Temporarily**
   - May be blocking too aggressively
   - Test with vGuard disabled

3. **Check Tor Status**
   - Tor can slow down browsing
   - Disable if not needed

4. **Clear DNS Cache**
   ```bash
   # Linux
   sudo systemd-resolve --flush-caches
   ```

## Best Practices

### For Maximum Performance

1. **Keep Browser Updated**
   - Updates include performance improvements
   - Check for updates regularly

2. **Use Lightweight Models**
   - TinyLlama for very slow systems
   - Phi-2 Mini for moderate systems
   - Larger models only for powerful systems

3. **Limit Background Processes**
   - Close other heavy applications
   - Free up system resources

4. **Use SSD Storage**
   - Faster than HDD
   - Improves startup time
   - Better cache performance

5. **Adequate RAM**
   - 2GB minimum
   - 4GB recommended
   - 8GB+ for best experience

## Performance Benchmarks

### Test System: Raspberry Pi 4 (4GB RAM, ARM64)

- **Startup Time**: 3-4 seconds
- **Page Load (simple)**: 1-2 seconds
- **Page Load (complex)**: 3-5 seconds
- **Memory Usage**: 300-500 MB
- **CPU Usage**: 10-20% during browsing

### Test System: Old Laptop (2GB RAM, Dual-core)

- **Startup Time**: 4-5 seconds
- **Page Load (simple)**: 2-3 seconds
- **Page Load (complex)**: 5-8 seconds
- **Memory Usage**: 400-600 MB
- **CPU Usage**: 15-30% during browsing

### Test System: Modern Desktop (8GB RAM, Quad-core)

- **Startup Time**: 1-2 seconds
- **Page Load (simple)**: < 1 second
- **Page Load (complex)**: 1-2 seconds
- **Memory Usage**: 200-400 MB
- **CPU Usage**: 5-10% during browsing

## Advanced Optimizations

### Environment Variables

```bash
# Increase Node.js memory (if building)
export NODE_OPTIONS="--max-old-space-size=4096"

# Disable hardware acceleration (if issues)
export ELECTRON_DISABLE_HARDWARE_ACCELERATION=1

# Enable GPU info (for debugging)
export ELECTRON_ENABLE_LOGGING=1
```

### System-Level Optimizations

#### Linux
```bash
# Set process priority
renice +10 -p $(pgrep vox-browser)

# Limit memory (if needed)
ulimit -v 2097152  # 2GB limit
```

#### Windows
- Use Task Manager to set priority
- Set to "Below Normal" for background use

## Monitoring Performance

### Built-in Tools

1. **vGuard Dashboard**
   - Shows blocking stats
   - Can indicate performance impact

2. **System Monitor**
   - Check CPU/RAM usage
   - Identify resource hogs

3. **Browser DevTools**
   - Performance tab
   - Memory profiler
   - Network monitor

## Conclusion

Vox Browser is designed to work well on slow systems while providing excellent performance on modern hardware. The automatic optimization system ensures the best experience for your specific system configuration.

For additional help, see the main README.md or contact support.

