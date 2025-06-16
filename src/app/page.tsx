'use client';

import React,{useState} from "react";
import MUNForm from "@/components/MUNForm";
import MUNOutput from "@/components/MUNOutput";
import { headers } from "next/headers";

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
      fullContext = committee ? 'Committee: ${committee}. ${context}'.trim() : context;
    }

    try {
      const response = await fetch('http://localhost:5001/api/chat/speech', {
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
    setOutput('');
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen p-3 sm:p-4 md:p-8 flex items-start justify-center">
        <div className={`transition-all duration-700 ease-in-out ${
          submitted 
            ? 'w-full max-w-7xl flex flex-col lg:flex-row items-start space-y-0 lg:space-x-0' 
            : 'w-full max-w-lg sm:max-w-2xl'
        }`}>
          
          {/* Form Section */}
          <div className={`bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl transition-all duration-700 ${
            submitted 
              ? 'w-full lg:w-2/5 flex-shrink-0' 
              : 'w-full'
          } ${submitted ? 'transform scale-95 lg:scale-100' : ''}`}>
            
            {/* Header */}
            <div className="text-center p-4 sm:p-6 lg:p-8 pb-4 sm:pb-6 border-b border-gray-100">
              <div className="inline-flex items-center justify-center w-25 h-25 sm:w-20 sm:h-20 bg-white rounded-full mb-4 shadow-lg border border-gray-200">
                <img
                src="https://upload.wikimedia.org/wikipedia/commons/e/ee/UN_emblem_blue.svg"
                alt="UN Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              />
            </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-unifraktur text-gray-800 mb-2">
                DiploMate
              </h1>
              <p className="text-gray-600 max-w-md mx-auto leading-relaxed text-sm sm:text-base px-2">
                AI-powered diplomatic speech generator for Model UN conferences. 
                Create compelling, country-specific responses in seconds.
              </p>
            </div>

            {/* Form */}
            <div className="p-4 sm:p-6 lg:p-8">
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

            {/* Features */}
            {!submitted && (
              <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
                <div className="grid grid-cols-2 gap-2 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-100">
                  <div className="text-center p-2 sm:p-4 bg-blue-50 rounded-lg sm:rounded-xl">
                    <div className="text-lg sm:text-2xl mb-1 sm:mb-2">⚡</div>
                    <div className="text-xs sm:text-sm font-medium text-gray-700">Instant Generation</div>
                    <div className="text-xs text-gray-500 mt-1 hidden sm:block">AI-powered responses in seconds</div>
                  </div>
                  <div className="text-center p-2 sm:p-4 bg-indigo-50 rounded-lg sm:rounded-xl">
                    <div className="text-lg sm:text-2xl mb-1 sm:mb-2">🎯</div>
                    <div className="text-xs sm:text-sm font-medium text-gray-700">Country-Specific</div>
                    <div className="text-xs text-gray-500 mt-1 hidden sm:block">Tailored to your nation's stance</div>
                  </div>
                  <div className="text-center p-2 sm:p-4 bg-purple-50 rounded-lg sm:rounded-xl">
                    <div className="text-lg sm:text-2xl mb-1 sm:mb-2">📝</div>
                    <div className="text-xs sm:text-sm font-medium text-gray-700">Multiple Formats</div>
                    <div className="text-xs text-gray-500 mt-1 hidden sm:block">Speeches, papers, amendments</div>
                  </div>
                  <div className="text-center p-2 sm:p-4 bg-green-50 rounded-lg sm:rounded-xl">
                    <div className="text-lg sm:text-2xl mb-1 sm:mb-2">🌍</div>
                    <div className="text-xs sm:text-sm font-medium text-gray-700">Global Coverage</div>
                    <div className="text-xs text-gray-500 mt-1 hidden sm:block">All UN member states supported</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Output Section */}
          {submitted && (
            <MUNOutput 
              output={output} 
              handleBack={handleBack}
              country={country}
              topic={topic}
              type={type}
            />
          )}
        </div>
      </div>
    </div>
  );

}
  