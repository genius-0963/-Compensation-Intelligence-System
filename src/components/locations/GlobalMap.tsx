"use client";

import React, { useMemo } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { useRouter } from 'next/navigation';

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

export default function GlobalMap({ locations = [] }: { locations: any[] }) {
  const router = useRouter();

  const markers = useMemo(() => {
    return locations.filter(l => l.latitude && l.longitude).map(loc => ({
      name: loc.city,
      coordinates: [loc.longitude, loc.latitude] as [number, number],
      citySlug: loc.city.toLowerCase().replace(/ /g, '-')
    }));
  }, [locations]);

  return (
    <div className="w-full h-full min-h-[450px]">
      <ComposableMap
        projectionConfig={{
          scale: 140
        }}
        width={800}
        height={400}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#1f2937"
                stroke="#111827"
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { fill: "#374151", outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {markers.map(({ name, coordinates, citySlug }) => (
          <Marker 
            key={name} 
            coordinates={coordinates}
            onClick={() => router.push(`/locations/city/${citySlug}`)}
            style={{
              default: { cursor: "pointer" },
              hover: { cursor: "pointer" },
              pressed: { cursor: "pointer" }
            }}
          >
            <circle r={4} fill="#3b82f6" stroke="#fff" strokeWidth={1} className="hover:fill-blue-400 transition-colors" />
            <title>{name}</title>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
}
