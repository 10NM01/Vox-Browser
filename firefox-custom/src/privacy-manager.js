// Privacy Manager - Blocks Google and other tracking services

class PrivacyManager {
    constructor() {
        this.blockedDomains = [
            // Google services
            'google-analytics.com',
            'googletagmanager.com',
            'googleadservices.com',
            'doubleclick.net',
            'googlesyndication.com',
            'googletagservices.com',
            'googleapis.com/analytics',
            'gstatic.com/analytics',
            // Facebook tracking
            'facebook.com/tr',
            'facebook.net',
            // Other trackers
            'scorecardresearch.com',
            'quantserve.com',
            'outbrain.com',
            'taboola.com'
        ];
        
        this.allowedDomains = [
            'duckduckgo.com',
            'startpage.com',
            'searx.org',
            'qwant.com'
        ];
    }

    isBlocked(url) {
        const lowerUrl = url.toLowerCase();
        for (const domain of this.blockedDomains) {
            if (lowerUrl.includes(domain)) {
                return true;
            }
        }
        return false;
    }

    isAllowed(url) {
        const lowerUrl = url.toLowerCase();
        for (const domain of this.allowedDomains) {
            if (lowerUrl.includes(domain)) {
                return true;
            }
        }
        return false;
    }

    sanitizeUrl(url) {
        // Remove tracking parameters
        try {
            const urlObj = new URL(url);
            const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid', 'ref'];
            
            trackingParams.forEach(param => {
                urlObj.searchParams.delete(param);
            });
            
            return urlObj.toString();
        } catch (e) {
            return url;
        }
    }
}

module.exports = { PrivacyManager };

