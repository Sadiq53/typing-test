import React, { useEffect, useRef } from 'react';

const GoogleAds = () => {
    const adRef = useRef(null);

    useEffect(() => {
        const loadAds = () => {
            if (window.adsbygoogle && adRef.current) {
                // Check if the innerHTML is empty to prevent multiple ads
                if (!adRef.current.innerHTML) {
                    console.log("Pushing ad...");
                    window.adsbygoogle.push({});
                }
            }
        };

        // Load the Google Ads script if not already loaded
        if (!window.adsbygoogle) {
            const script = document.createElement('script');
            script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9363292015129803";
            script.async = true;
            script.onload = loadAds; // Load ads once the script is fully loaded
            script.onerror = () => console.error('Failed to load adsbygoogle script');
            document.body.appendChild(script);
        } else {
            loadAds();
        }
    }, []);

    return (
        <div>
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-9363292015129803"
                data-ad-slot="3193362948"
                data-ad-format="auto"
                data-full-width-responsive="true"
            ></ins>
        </div>
    );
};

export default GoogleAds;
