"use client"

import type { FormEvent } from "react"
import { motion } from "motion/react"
import { Check, LoaderCircle, Save } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { UserProfile } from "@/features/shared/types/api"

// Edit the profile display name while keeping the signed-in email visible.
export function AccountProfileCard({
  user,
  name,
  onNameChange,
  onSubmit,
  saving,
  error,
  message,
}: {
  user: UserProfile
  name: string
  onNameChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  saving: boolean
  error: string
  message: string
}) {
  return (
    <Card className="mt-8 rounded-xl">
      <CardHeader className="p-5 pb-0 sm:p-8 sm:pb-0">
        <div className="flex items-center gap-4 border-b pb-6">
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Avatar className="size-14">
              <AvatarImage src={user.picture ?? undefined} alt="" />
              <AvatarFallback className="bg-primary/10 font-serif text-xl text-primary">
                {user.name?.slice(0, 1) ?? user.email.slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </motion.div>
          <div className="min-w-0">
            <CardTitle className="truncate font-serif text-xl tracking-tight">
              {user.name ?? "Your profile"}
            </CardTitle>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5 sm:p-8">
        <form onSubmit={onSubmit}>
          <Label className="text-xs" htmlFor="display-name">
            Display name
          </Label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <Input
              autoComplete="name"
              className="h-11 min-w-0 flex-1 rounded-xl text-sm"
              id="display-name"
              maxLength={100}
              minLength={2}
              onChange={(event) => onNameChange(event.target.value)}
              placeholder="How should we address you?"
              value={name}
            />
            <Button
              className="h-11 rounded-full px-5 text-xs"
              disabled={saving || name.trim() === (user.name ?? "")}
              type="submit"
            >
              {saving ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Save changes
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Use 2 to 100 characters.
          </p>
          {error ? (
            <Alert variant="destructive" className="mt-3">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          {message ? (
            <Alert className="mt-3">
              <Check className="size-4 text-primary" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          ) : null}
        </form>
      </CardContent>
    </Card>
  )
}
