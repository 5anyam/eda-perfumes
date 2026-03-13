// components/FacebookPixel.tsx
'use client';

import React from 'react';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';

interface FacebookPixelProps {
  pixelId: number;
}

export default function FacebookPixel({ pixelId }: FacebookPixelProps): React.ReactElement {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views on route changes (both client pixel + CAPI)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      const eventId = `PageView_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      window.fbq('track', 'PageView', {}, { eventID: eventId });

      // Send PageView to CAPI
      const fbp = document.cookie.split(';').find(c => c.trim().startsWith('_fbp='))?.split('=')[1];
      const fbc = document.cookie.split(';').find(c => c.trim().startsWith('_fbc='))?.split('=')[1];

      fetch('/api/meta-capi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_name: 'PageView',
          event_id: eventId,
          event_source_url: window.location.href,
          user_data: { fbp, fbc },
        }),
      }).catch(() => {});
    }
  }, [pathname, searchParams]);

  return (
    <React.Fragment>
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `,
        }}
      />
    </React.Fragment>
  );
}
