import TerminalOverlay from "@/components/TerminalOverlay"
import { Button } from "@/components/ui/button"
import UserPrograms from "@/components/UserPrograms"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-hidden">
      <section className="relative z-10 py-24 flex-grow">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative"> 
            {/* CORNER DECORATION */}
            <div className="absolute -top-10 left-0 w-40 h-40 border-l-2 border-t-2 border-border"/>
            {/* LEFT SIDE CONTENT */}
            <div className="lg:col-span-7 space-y-8 relative pl-2">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <div>
                  <span className="text-foreground">Transform</span>
                </div>
                <div>
                  <span className="text-primary">Your Body</span>
                </div>
                <div className="pt-2">
                  <span className="text-foreground">With Advanced</span>
                </div>
                <div className="pt-2">
                  <span className="text-foreground">AI</span>
                  <span className="text-primary pl-4">Technology</span>
                </div>
              </h1>
              {/* SEPERATOR LINE */}
              <div className="h-px w-full bg-gradient-to-r from-primary via-secondary to-primary
              opacity-50"></div>

              <p className="text-xl text-muted-foreground w-2/3">
                Talk to our AI assistant and get personalizes diet plans and workout routines
                designed just for you.
              </p>

              {/* STATS */}
              <div className="flex items-center gap-10 py-6 font-mono">
                <div className="flex flex-col">
                  <div className="text-2xl text-primary">500+</div>
                  <div className="text-xs uppercase tracking-wider">ACTIVE USERS</div>
                </div>
                <div className="h-12 w-px bg-gradient-to-b from-transparent via-border to-transparent"></div>
                <div className="flex flex-col">
                  <div className="text-2xl text-primary">3min</div>
                  <div className="text-xs uppercase tracking-wider">GENERATION</div>
                </div>
                <div className="h-12 w-px bg-gradient-to-b from-transparent via-border to-transparent"></div>
                <div className="flex flex-col">
                  <div className="text-2xl text-primary">100%</div>
                  <div className="text-xs uppercase tracking-wider">PERSONALIZED</div>
                </div>
              </div>

              {/* BUTTON */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  size='lg'
                  asChild
                  className="overflow-hidden bg-primary text-primary-foreground px-8 py-6 text-lg font-medium"
                >
                  <Link href={"/generate-program"} className="flex items-center font-mono">
                    Build Your Program
                    <ArrowRight className="ml-2 size-5"/>
                  </Link>  
                </Button>  
              </div>
            </div>

            {/* RIGHT SIDE CONTENT */}
            <div className="lg:col-span-5 relative">
              {/* CORNER SIDE PIECES */}
              <div className="absolute -inset-4 pointer-events-none">
                <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-border"/>
                <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-border"/>
                <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-border"/>
                <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-border"/>
              </div>
              {/* IMAGE CONTAINER */}
              <div className="relative aspect-square max-w-lg mx-auto">
                <div className="relative overflow-hidden rounded-lg bg-cyber-black">
                  <img src='/project-avatar-2.png'
                       alt="AI Fitness Coach"
                       className="size-full object-cover object-center"
                  />
                  {/* SCAN LINE */}
                  <div
                    className="absolute inset-0 animate-scanline pointer-events-none"
                    style={{
                      backgroundImage: `linear-gradient(
                        transparent 0%,
                        transparent calc(50% - 1px),
                        var(--cyber-glow-primary) 50%,
                        transparent calc(50% + 1px),
                        transparent 100%
                      )`,
                      backgroundSize: '100% 8px',
                    }}
                  />
                  {/* DECORATION ON THE TOP OF IMAGE */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 border border-primary/40 rounded-full"/>

                    {/* Targeting Lines */}
                    <div className="absolute top-1/2 left-0 w-1/4 h-px bg-primary/50"/>
                    <div className="absolute top-1/2 right-0 w-1/4 h-px bg-primary/50"/>
                    <div className="absolute top-0 left-1/2 h-1/4 w-px bg-primary/50"/>
                    <div className="absolute bottom-0 left-1/2 h-1/4 w-px bg-primary/50"/>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"/>
                </div>
                {/* TERMINAL */}
                <TerminalOverlay />
              </div>
            </div>
          </div>
        </div>
      </section>
      <UserPrograms  />
    </div>
  )
}

export default HomePage