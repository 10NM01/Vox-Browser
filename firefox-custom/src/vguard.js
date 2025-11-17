// vGuard Security Dashboard - Local ad and tracker blocking

class VGuard {
    constructor() {
        this.enabled = true;
        this.stats = {
            adsBlocked: 0,
            trackersBlocked: 0,
            threatsBlocked: 0,
            totalBlocked: 0
        };
        this.blockedDomains = new Set();
        this.torStatus = {
            active: false,
            connected: false,
            lastCheck: null
        };
        
        // Comprehensive ad and tracker blocklists
        this.adDomains = [
            // Ad networks
            'doubleclick.net', 'googlesyndication.com', 'googleadservices.com',
            'adsafeprotected.com', 'adnxs.com', 'advertising.com',
            'amazon-adsystem.com', 'advertising.amazon.com',
            'facebook.com/tr', 'facebook.net', 'fbcdn.net',
            'adsrvr.org', 'adtechus.com', 'advertising.com',
            'outbrain.com', 'taboola.com', 'criteo.com',
            'scorecardresearch.com', 'quantserve.com',
            // Tracking
            'google-analytics.com', 'googletagmanager.com',
            'analytics.google.com', 'ga.js', 'analytics.js',
            'hotjar.com', 'mouseflow.com', 'fullstory.com',
            'mixpanel.com', 'segment.com', 'amplitude.com',
            // Malware/Phishing
            'malware.com', 'phishing.com', 'suspicious-domain.com'
        ];
        
        this.trackerDomains = [
            'google-analytics.com', 'googletagmanager.com',
            'doubleclick.net', 'googlesyndication.com',
            'facebook.com/tr', 'facebook.net',
            'scorecardresearch.com', 'quantserve.com',
            'adnxs.com', 'advertising.com',
            'criteo.com', 'outbrain.com', 'taboola.com'
        ];
    }

    isBlocked(url) {
        if (!this.enabled) return false;
        
        const lowerUrl = url.toLowerCase();
        
        // Check against blocklists
        for (const domain of this.adDomains) {
            if (lowerUrl.includes(domain)) {
                this.blockedDomains.add(domain);
                this.stats.adsBlocked++;
                this.stats.totalBlocked++;
                return { blocked: true, type: 'ad', domain: domain };
            }
        }
        
        for (const domain of this.trackerDomains) {
            if (lowerUrl.includes(domain)) {
                this.blockedDomains.add(domain);
                this.stats.trackersBlocked++;
                this.stats.totalBlocked++;
                return { blocked: true, type: 'tracker', domain: domain };
            }
        }
        
        return { blocked: false };
    }

    enable() {
        this.enabled = true;
    }

    disable() {
        this.enabled = false;
    }

    isEnabled() {
        return this.enabled;
    }

    getStats() {
        return {
            ...this.stats,
            enabled: this.enabled,
            blockedDomainsCount: this.blockedDomains.size
        };
    }

    resetStats() {
        this.stats = {
            adsBlocked: 0,
            trackersBlocked: 0,
            threatsBlocked: 0,
            totalBlocked: 0
        };
        this.blockedDomains.clear();
    }

    updateTorStatus(status) {
        this.torStatus = {
            active: status.active || false,
            connected: status.connected || false,
            lastCheck: new Date().toISOString()
        };
    }

    getTorStatus() {
        return this.torStatus;
    }
}

module.exports = { VGuard };

