"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { vapi } from "@/lib/vapi";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react"

const GenerateProgram = () => {

  const [callActive, setCallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [callEnded, setCallEnded] = useState(false);

  const router = useRouter();
  const { user } = useUser();
  const messageContainerRef = useRef<HTMLDivElement>(null);

  //auto-scroll messages
  useEffect(() => {
    if(messageContainerRef.current){
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight
    }
  }, [messages])

  //redirect to profille page
  useEffect(() => {
    if(callEnded){
      const redirectTimer = setTimeout(() => {
        router.push("/profile")
      }, 1500);
      return () => clearTimeout(redirectTimer);
    }
  }, [callEnded, router]);

  //setup event listener for vapi
  useEffect(() => {
    const handleCallStart = () => {
      console.log("Call Started");
      setConnecting(false);
      setCallActive(true);
      setCallEnded(false);
    }

    const handleCallEnd = () => {
      console.log("Call Ended");
      setCallActive(false);
      setConnecting(false);
      setIsSpeaking(false);
      setCallEnded(true);
    }

    const handleSpeechStart = () => {
      console.log("AI started speaking");
      setIsSpeaking(true);
    }

    const handleSpeechEnd = () => {
      console.log("AI stopped Speaking");
      setIsSpeaking(false);
    }

    const handleMessage = (message: any) => {
      console.log("📥 Message received:", message); // DEBUG LOG
    
      // Some APIs send { type: 'transcript', transcript: { text: '...', type: 'final', role: 'user' } }
      if (message.type === "transcript" && message.transcript?.type === "final") {
        const newMessage = {
          content: message.transcript.text,
          role: message.transcript.role ?? "user",
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    
      // Fallback if structure is flat
      else if (message.transcriptType === "final") {
        const newMessage = {
          content: message.transcript,
          role: message.role ?? "user",
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    };
    

    const handleError = (error: any) => {
      console.log("Vapi error ", error);
      setConnecting(false);
      setCallActive(false);
    }

    vapi.on("call-start", handleCallStart)
        .on("call-end", handleCallEnd)
        .on("speech-start", handleSpeechStart)
        .on("speech-end", handleSpeechEnd)
        .on("message", handleMessage)
        .on("error", handleError)

    //clean event listener on unmount
    return () => {
      vapi.off("call-start", handleCallStart)
        .off("call-end", handleCallEnd)
        .off("speech-start", handleSpeechStart)
        .off("speech-end", handleSpeechEnd)
        .off("message", handleMessage)
        .off("error", handleError)
    }
  }, []);

  const toggleCall = async () => {
    if (callActive) {
      // end the call properly
      vapi.stop();
      return;
    }
  
    if (callEnded) {
      router.push("/profile");
      return;
    }
  
    try {
      setConnecting(true);
      setMessages([]);
      setCallEnded(false);
  
      const fullName = user?.firstName ? `${user.firstName } ${user.lastName || "" }`.trim() : "There";
  
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          full_name: fullName
        }
      });
    } catch (error) {
      console.error("Failed to start call");
      setConnecting(false);
    }
  }
  
  
  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-hidden pb-6 pt-24">
      <div className="container mx-auto px-4 h-full max-w-5xl">
        
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-mono">
            <span>Generate Your</span>
            <span className="text-primary uppercase">Fitness Program</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Have a voice conversation with our AI assistant to create your personalized plan
          </p>
        </div>

        {/* Video call area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* AI assistant  card */}
          <Card className="bg-card/90 backdrop-blur-sm border border-border overflow-hidden relative">
            <div className="aspect-video flex flex-col items-center justify-center p-6 relative">
            {/* AI VOICE ANIMATION */}
              <div
                  className={`absolute inset-0 ${
                    isSpeaking ? "opacity-30" : "opacity-0"
                  } transition-opacity duration-300`}
                >
                  {/* Voice wave animation when speaking */}
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-center items-center h-20">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`mx-1 h-16 w-1 bg-primary rounded-full ${
                          isSpeaking ? "animate-sound-wave" : ""
                        }`}
                        style={{
                          animationDelay: `${i * 0.1}s`,
                          height: isSpeaking ? `${Math.random() * 50 + 20}%` : "5%",
                        }}
                      />
                    ))}
                </div>
              </div>

              {/* AI IMAGE PLACER */}
              <div className="relative size-32 mb-4">
                {/* Glow effect */}
                <div
                  className={`absolute inset-0 bg-primary opacity-10 rounded-full blur-lg ${
                    isSpeaking ? "animate-pulse" : ""
                  }`}
                />

                {/* Outer circle container */}
                <div className="relative size-32 rounded-full bg-card flex items-center justify-center border border-border overflow-hidden z-10">
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-b from-primary/10 to-secondary/10 z-20" />

                  {/* Circular image */}
                  <img
                    src="/project-avatar.png"
                    alt="AI Assistant"
                    className="w-full h-full object rounded-full z-10"
                  />
                </div>
              </div>
              <h2 className="text-xl font-bold text-foreground">YourFitness AI</h2>
              <p className="text-sm text-muted-foreground mt-1">Fitness & Diet Coach</p>
              <div className={`mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border
                ${isSpeaking ? "border-primary" : ""
              }`}>
                <div className={`w-2 h-2 rounded-full ${isSpeaking ? "bg-primary animate-pulse" : ""}`}/>
                <span className="text-xs text-muted-foreground">
                  {isSpeaking ? "Speaking.." : callActive ? "Listening..." : callEnded ? "Redirecting to profile..." : "Waiting"}
                </span>
              </div>
            </div>
          </Card>

          {/* User card */}
          <Card className={`bg-card/90 backdrop-blur-sm border overflow-hidden relative`}>
            <div className="aspect-video flex flex-col items-center justify-center p-6 relative">
              {/* User Image */}
              <div className="relative size-32 mb-4">
                <img
                  src={user?.imageUrl}
                  alt="User"
                  // ADD THIS "size-full" class to make it rounded on all images
                  className="size-full object-cover rounded-full"
                />
              </div>

              <h2 className="text-xl font-bold text-foreground">You</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {user ? (user.firstName + " " + (user.lastName || "")).trim() : "Guest"}
              </p>

              {/* User Ready Text */}
              <div className={`mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-card border`}>
                <div className={`w-2 h-2 rounded-full bg-muted`} />
                <span className="text-xs text-muted-foreground">Ready</span>
              </div>
            </div>
          </Card>
        </div>

        {/* MESSAGE CONTAINER */}
        {messages.length > 0 && (
          <div
            ref={messageContainerRef}
            className="w-full bg-card/90 backdrop-blur-sm border border-border rounded-xl p-4 mb-8 h-64 overflow-y-auto transition-all duration-300 scroll-smooth"
          >
            <div className="space-y-3">
              {messages.map((msg, index) => (
                <div key={index} className="message-item animate-fadeIn">
                  <div className="font-semibold text-xs text-muted-foreground mb-1">
                    {msg.role === "assistant" ? "YourFitness AI" : "You"}:
                  </div>
                  <p className="text-foreground">{msg.content}</p>
                </div>
              ))}

              {callEnded && (
                <div className="message-item animate-fadeIn">
                  <div className="font-semibold text-xs text-primary mb-1">System:</div>
                  <p className="text-foreground">
                    Your fitness program has been created! Redirecting to your profile...
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

          {/* CALL CONTROLS */}
          <div className="w-full flex justify-center gap-4">
            <Button
              className={`relative w-40 h-12 text-xl rounded-3xl ${
                callActive
                  ? "bg-destructive hover:bg-destructive/90"
                  : callEnded
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-primary hover:bg-primary/90"
              } text-white`}
              onClick={toggleCall}
              disabled={connecting || callEnded}
            >
              {/* Animate Ping Circle */}
              {connecting && (
                <span className="absolute w-36 h-15 bg-primary/40 rounded-full animate-ping z-0"></span>
              )}

              {/* Button Text */}
              <span className="relative z-10">
                {callActive
                  ? "End Call"
                  : connecting
                  ? "Connecting..."
                  : callEnded
                  ? "View Profile"
                  : "Start Call"}
              </span>
            </Button>
          </div>

      </div>
    </div>
  )
}

export default GenerateProgram