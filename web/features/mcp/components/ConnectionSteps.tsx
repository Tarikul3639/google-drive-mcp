import { connectionSteps } from "../connect-data"

// List the four steps required to connect an MCP-compatible client.
export function ConnectionSteps() {
  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <p className="font-mono text-[10px] tracking-[0.18em] text-primary">
          GETTING STARTED
        </p>
        <h2 className="font-serif text-2xl tracking-tight sm:text-3xl">
          How to connect
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Follow these steps to connect Drivebridge to your AI client.
        </p>
      </div>
      <div className="space-y-3">
        {connectionSteps.map((step) => {
          const Icon = step.icon
          return (
            <div
              key={step.number}
              className="flex gap-4 rounded-2xl border border-border/70 bg-background/80 p-4 shadow-sm transition-colors hover:border-primary/30 sm:p-5"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-4" />
              </div>
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {step.number}
                  </span>
                  <h3 className="text-sm font-medium">{step.title}</h3>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
