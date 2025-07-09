import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Shield, ShieldCheck, User, Trash2 } from 'lucide-react'
import blogService from '../services/blogs'

const AdminPanel = () => {
  const user = useSelector((state) => state.user)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Debug logging
  console.log('AdminPanel - User:', user)
  console.log('AdminPanel - User isAdmin:', user?.isAdmin)

  // Redirect if not admin
  if (!user || !user.isAdmin) {
    console.log('AdminPanel - Redirecting: user not admin')
    navigate('/')
    return null
  }

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch('/api/users')
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      return response.json()
    },
  })

  const deleteUserMutation = useMutation({
    mutationFn: async (userId) => {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error('Failed to delete user')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-8rem)]">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8 flex items-center">
          <Shield className="w-8 h-8 mr-3" />
          Admin Panel
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((targetUser) => (
                <div
                  key={targetUser.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5" />
                    <div>
                      <div className="font-medium">{targetUser.name}</div>
                      <div className="text-sm text-muted-foreground">
                        @{targetUser.username}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {targetUser.blogs?.length || 0} blog(s)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {targetUser.isAdmin && (
                      <Badge variant="secondary" className="flex items-center">
                        <ShieldCheck className="w-3 h-3 mr-1" />
                        Admin
                      </Badge>
                    )}

                    {targetUser.id !== user.id && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (
                            window.confirm(
                              `Are you sure you want to delete user "${targetUser.username}"? This will also delete all their blogs and cannot be undone.`,
                            )
                          ) {
                            deleteUserMutation.mutate(targetUser.id)
                          }
                        }}
                        disabled={deleteUserMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete User
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminPanel
