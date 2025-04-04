"use client";
import { useState, useEffect } from "react";
import { getContract } from "@/lib/web3";
import dynamic from 'next/dynamic';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface Coordinates {
  lat: number;
  lng: number;
}

type Report = {
  id: string;
  image: string;
  location: string;
  description: string;
  completed: boolean;
  timestamp?: number;
  coordinates?: Coordinates;
};

export default function Dashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([13.044941, 80.199680]); // Default Chennai coords
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0
  });

  // Parse location string into coordinates
  const parseCoordinates = (location: string): Coordinates | undefined => {
    try {
      const parts = location.split(',').map(part => parseFloat(part.trim()));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return { lat: parts[0], lng: parts[1] };
      }
      return undefined;
    } catch (error) {
      console.error("Failed to parse coordinates:", error);
      return undefined;
    }
  };

  useEffect(() => {
    loadReports();
    
    // Set map loaded after component mounts
    setMapLoaded(true);
    
    // Initialize Leaflet icon
    if (typeof window !== 'undefined') {
      // Fix Leaflet default icon issue
      import('leaflet').then((L) => {
        delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        });
      });
    }
  }, []);

  // Update map center when selected report changes
  useEffect(() => {
    if (selectedReport?.coordinates) {
      setMapCenter([selectedReport.coordinates.lat, selectedReport.coordinates.lng]);
    } else {
      // Find any report with coordinates
      const reportWithCoords = reports.find(r => r.coordinates);
      if (reportWithCoords?.coordinates) {
        setMapCenter([reportWithCoords.coordinates.lat, reportWithCoords.coordinates.lng]);
      }
    }
  }, [selectedReport, reports]);

  const loadReports = async () => {
    setIsLoading(true);
    const contract = await getContract();
    if (contract) {
      try {
        const reportCount = await contract.reportCount();
        const reportCountNum = Number(reportCount);
        
        const reportList: Report[] = [];
        let completedCount = 0;
        
        for (let i = 1; i <= reportCountNum; i++) {
          const report = await contract.reports(i);
          const timestamp = report.timestamp ? Number(report.timestamp) : 0;
          
          const coordinates = parseCoordinates(report.location);
          
          const reportItem: Report = {
            id: report.id.toString(),
            image: report.imageHash,
            location: report.location,
            description: report.description,
            completed: report.completed,
            timestamp,
            coordinates
          };
          
          reportList.push(reportItem);
          
          if (report.completed) {
            completedCount++;
          }
        }
        
        // Sort reports by newest first
        reportList.sort((a, b) => {
          return (b.timestamp || 0) - (a.timestamp || 0);
        });
        
        setReports(reportList);
        if (reportList.length > 0) {
          setSelectedReport(reportList[0]);
        }
        
        setStats({
          total: reportCountNum,
          completed: completedCount,
          pending: reportCountNum - completedCount
        });
      } catch (error) {
        console.error("Failed to load reports:", error);
      }
    }
    setIsLoading(false);
  };

  const markAsCompleted = async (id: string) => {
    const contract = await getContract();
    if (contract) {
      try {
        const tx = await contract.completeReport(id);
        await tx.wait();
        loadReports();
      } catch (error) {
        console.error("Failed to mark as completed:", error);
        alert("Failed to update report status");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      {/* Header */}
      <header className="bg-green-600 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-white">Waste Management Dashboard</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        {/* Stats section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="rounded-full bg-green-100 p-2 mr-3">
                <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Reports</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="rounded-full bg-yellow-100 p-2 mr-3">
                <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Pending</p>
                <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-600">
            <div className="flex items-center">
              <div className="rounded-full bg-green-100 p-2 mr-3">
                <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Completed</p>
                <p className="text-2xl font-bold text-gray-800">{stats.completed}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Reports list */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full">
              <div className="bg-green-600 p-4 text-white">
                <h2 className="text-lg font-bold flex items-center justify-between">
                  <span>Reports List</span>
                  <span className="text-xs bg-green-500 px-2 py-1 rounded-full">{reports.length}</span>
                </h2>
              </div>
              
              <div className="overflow-auto" style={{ maxHeight: '600px' }}>
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <svg className="animate-spin h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                ) : reports.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No reports found</div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {reports.map((report) => (
                      <div 
                        key={report.id} 
                        className={`p-3 hover:bg-gray-50 cursor-pointer transition ${selectedReport?.id === report.id ? 'bg-green-50' : ''}`}
                        onClick={() => setSelectedReport(report)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden">
                            <img src={report.image} alt="Report" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {report.description.length > 30 
                                ? report.description.substring(0, 30) + '...' 
                                : report.description}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center">
                              <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                              </svg>
                              {report.location.length > 15 
                                ? report.location.substring(0, 15) + '...' 
                                : report.location}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                              report.completed 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {report.completed ? 'Completed' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Details and Map */}
          <div className="w-full lg:w-2/3">
            <div className="grid grid-cols-1 gap-6">
              {/* Map */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-green-600 p-4 text-white">
                  <h2 className="text-lg font-bold">Location Map</h2>
                </div>
                <div className="h-96 relative">
                  {mapLoaded && (
                    <>
                      {/* Leaflet CSS */}
                      <link
                        rel="stylesheet"
                        href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
                        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
                        crossOrigin=""
                      />
                      {/* Map container */}
                      <div id="map-container" className="h-full w-full">
                        {typeof window !== 'undefined' && (
                          <MapContainer
                            key={`map-${mapCenter.join(',')}`}
                            style={{ height: '100%', width: '100%' }}
                            center={mapCenter}
                            zoom={13}
                            scrollWheelZoom={false}
                          >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            
                            {reports.filter(r => r.coordinates).map((report) => (
                              report.coordinates && (
                                <Marker 
                                  key={report.id}
                                  position={[report.coordinates.lat, report.coordinates.lng]}
                                >
                                  <Popup>
                                    <div className="w-40">
                                      <div className="mb-2">
                                        <img src={report.image} alt="Report" className="w-full h-20 object-cover rounded" />
                                      </div>
                                      <div className="text-xs font-semibold">{report.description.substring(0, 50)}{report.description.length > 50 ? '...' : ''}</div>
                                      <div className="text-xs text-gray-500 mt-1">{report.completed ? 'Completed' : 'Pending'}</div>
                                    </div>
                                  </Popup>
                                </Marker>
                              )
                            ))}
                          </MapContainer>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Selected Report Detail */}
              {selectedReport && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-green-600 p-4 text-white">
                    <h2 className="text-lg font-bold">Report Details</h2>
                  </div>
                  <div className="p-4">
                    <div className="mb-4">
                      <img src={selectedReport.image} alt="Report" className="w-full h-48 object-cover rounded-lg" />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Description</h3>
                        <p className="text-gray-800">{selectedReport.description}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Location</h3>
                        <p className="text-gray-800">{selectedReport.location}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Status</h3>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          selectedReport.completed 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedReport.completed ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                      <div className="pt-2">
                        {!selectedReport.completed && (
                          <button
                            onClick={() => markAsCompleted(selectedReport.id)}
                            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 w-full sm:w-auto"
                          >
                            Mark as Completed
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
