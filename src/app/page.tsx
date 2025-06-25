'use client';

import React,{useState} from "react";
import MUNForm from "@/components/MUNForm";
import MUNOutput from "@/components/MUNOutput";
// import { headers } from "next/headers";

export default function Home(){
  const [country,setCountry] = useState('');
  const [committee,setCommittee] = useState('');
  const [topic, setTopic] = useState('');
  const [type, setType] = useState('');
  const [context, setContext] = useState('');
  const [output, setOutput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent)=> {
    e.preventDefault();
    setIsLoading(true);

    //build context string
    let fullContext = context;
    if(committee){
      fullContext = committee ? `Committee: ${committee}. ${context}`.trim() : context;
    }

    try {
      const response = await fetch('https://mun-1igc.onrender.com/api/chat/speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic,
          country: country,
          type: type,
          committee:committee,
          context: fullContext
        }),
      });

      if(!response.ok) throw new Error('netwrok error');

      const data = await response.json();
      setOutput(data.speech);
      setSubmitted(true);
  }catch(error){
    console.error('Fetch error:',error);
    setOutput('Sorry, something went wrong. Please try again later.');
    setSubmitted(true);
  }finally {
      setIsLoading(false);
    }
};
const handleBack = () => {
    setSubmitted(false);
    // Keep the output visible, don't clear it
  };

  const handleReset = () => {
    // Reset all state to initial values
    setCountry('');
    setCommittee('');
    setTopic('');
    setType('');
    setContext('');
    setOutput('');
    setSubmitted(false);
    setIsLoading(false);
  };
  return (
    <div className="min-h-screen bg-stone-50 from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-200">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/e/ee/UN_emblem_blue.svg"
                  alt="UN Logo"
                  className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold font-unifraktur text-gray-800">
                  DiploMate
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                  AI-powered MUN assistant
                </p>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="flex items-center gap-4">
              {output && (
                <>
                  
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 sm:px-6 sm:py-2.5 bg-amber-100 hover:bg-stone-100 text-black rounded-xl font-medium transition-colors shadow-lg text-sm sm:text-base"
                  >
                    Clear Speech
                  </button>
                </>
              )}
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Ready to generate</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content with top padding to account for fixed header */}
      <div className="relative z-10 pt-24 sm:pt-28 pb-8 px-3 sm:px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          
        </div>

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            
            {/* Left Column - Form */}
            <div className="bg-amber-50/80 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl h-fit">
              <div className="p-6 sm:p-8">
                <div className="border-b border-gray-200 pb-4 mb-6">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                    {output ? 'Edit Speech Parameters' : 'Generate Your Speech'}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600">
                    {output ? 'Modify settings and generate new content' : 'Fill in the details below to create your diplomatic response'}
                  </p>
                </div>
                
                <MUNForm
                  country={country}
                  setCountry={setCountry}
                  committee={committee}
                  setCommittee={setCommittee}
                  topic={topic}
                  setTopic={setTopic}
                  type={type}
                  setType={setType}
                  context={context}
                  setContext={setContext}
                  submitted={submitted}
                  isLoading={isLoading}
                  handleSubmit={handleSubmit}
                />
              </div>
            </div>

            {/* Right Column - Output (always show if we have output) */}
            <div className="transition-all duration-700 ease-in-out">
              {output ? (
                /* Output Section - Show whenever we have output */
                <MUNOutput 
                  output={output} 
                  handleBack={handleBack}
                  country={country}
                  topic={topic}
                  type={type}
                />
              ) : (
                /* Features Section - Only show when no output exists */
                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8">
                  <div className="border-b border-gray-200 pb-4 mb-6">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">Why Choose DiploMate?</h2>
                    <p className="text-sm sm:text-base text-gray-600">Powerful features designed for MUN success</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <div className="text-3xl">⚡</div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">Instant Generation</h3>
                        <p className="text-sm text-gray-600">AI-powered responses generated in seconds, saving you valuable preparation time during committee sessions.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                      <div className="text-3xl">🎯</div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">Country-Specific Positioning</h3>
                        <p className="text-sm text-gray-600">Tailored responses that reflect your assigned country&apos;s real diplomatic stance and foreign policy priorities.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl border border-purple-100">
                      <div className="text-3xl">📝</div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">Multiple Document Types</h3>
                        <p className="text-sm text-gray-600">Generate opening speeches, position papers, draft resolutions, amendments, and working papers with ease.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
                      <div className="text-3xl">🌍</div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">Global Coverage</h3>
                        <p className="text-sm text-gray-600">Comprehensive support for all 193 UN member states with accurate diplomatic language and terminology.</p>
                      </div>
                    </div>                   
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}