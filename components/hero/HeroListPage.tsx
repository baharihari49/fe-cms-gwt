// components/hero/HeroListPage.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { heroAPI } from '@/lib/api/hero'
import { HeroSection, SocialMedia } from '@/components/hero/types/hero'
import { HeroSectionForm } from './HeroSectionForm'
import { SocialMediaForm } from './SocialMediaForm'
import { Plus, Edit, Trash2, Settings, Users } from 'lucide-react'

export function HeroListPage() {
    const [heroSections, setHeroSections] = useState<HeroSection[]>([])
    const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedHero, setSelectedHero] = useState<HeroSection | undefined>()
    const [selectedSocial, setSelectedSocial] = useState<SocialMedia | undefined>()
    const [isHeroDialogOpen, setIsHeroDialogOpen] = useState(false)
    const [isSocialDialogOpen, setIsSocialDialogOpen] = useState(false)

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const [heroResponse, socialResponse] = await Promise.all([
                heroAPI.getAllHeroSections(),
                heroAPI.getAllSocialMediaAdmin()
            ])
            setHeroSections(heroResponse.data)
            setSocialMedia(socialResponse.data)
        } catch (error) {
            toast.error('Failed to fetch data')
            console.log(error);
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleDeleteHero = async (id: string) => {
        try {
            await heroAPI.deleteHeroSection(id)
            toast.success('Hero section deleted successfully')
            fetchData()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to delete hero section')
        }
    }

    const handleDeleteSocial = async (id: string) => {
        try {
            await heroAPI.deleteSocialMedia(id)
            toast.success('Social media deleted successfully')
            fetchData()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to delete social media')
        }
    }

    const handleHeroSuccess = () => {
        setIsHeroDialogOpen(false)
        setSelectedHero(undefined)
        fetchData()
    }

    const handleSocialSuccess = () => {
        setIsSocialDialogOpen(false)
        setSelectedSocial(undefined)
        fetchData()
    }

    const openHeroDialog = (hero?: HeroSection) => {
        setSelectedHero(hero)
        setIsHeroDialogOpen(true)
    }

    const openSocialDialog = (social?: SocialMedia) => {
        setSelectedSocial(social)
        setIsSocialDialogOpen(true)
    }

    if (isLoading) {
        return (
            <div className="container mx-auto py-8">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg">Loading...</div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Hero Management</h1>
                    <p className="text-muted-foreground">
                        Manage your hero sections and social media links
                    </p>
                </div>
            </div>

            {/* Hero Sections Card */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Hero Sections
                        </CardTitle>
                        <CardDescription>
                            Manage the main hero sections of your website
                        </CardDescription>
                    </div>
                    <Dialog open={isHeroDialogOpen} onOpenChange={setIsHeroDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => openHeroDialog()}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Hero Section
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>
                                    {selectedHero ? 'Edit Hero Section' : 'Create Hero Section'}
                                </DialogTitle>
                                <DialogDescription>
                                    {selectedHero
                                        ? 'Update the hero section details.'
                                        : 'Create a new hero section for your website.'
                                    }
                                </DialogDescription>
                            </DialogHeader>
                            <HeroSectionForm
                                heroSection={selectedHero}
                                onSuccess={handleHeroSuccess}
                                onCancel={() => setIsHeroDialogOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {heroSections.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                        <div className="text-muted-foreground">
                                            No hero sections found. Create your first one!
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                heroSections.map((hero) => (
                                    <TableRow key={hero.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">
                                                    {hero.mainTitle} {hero.highlightText}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {hero.welcomeText}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-xs">
                                            <div className="truncate">{hero.description}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={hero.isActive ? 'default' : 'secondary'}>
                                                {hero.isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(hero.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openHeroDialog(hero)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Hero Section</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to delete this hero section? This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDeleteHero(hero.id)}
                                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Social Media Card */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Social Media Links
                        </CardTitle>
                        <CardDescription>
                            Manage your social media links and their display order
                        </CardDescription>
                    </div>
                    <Dialog open={isSocialDialogOpen} onOpenChange={setIsSocialDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => openSocialDialog()}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Social Media
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>
                                    {selectedSocial ? 'Edit Social Media' : 'Add Social Media'}
                                </DialogTitle>
                                <DialogDescription>
                                    {selectedSocial
                                        ? 'Update the social media link details.'
                                        : 'Add a new social media link.'
                                    }
                                </DialogDescription>
                            </DialogHeader>
                            <SocialMediaForm
                                socialMedia={selectedSocial}
                                onSuccess={handleSocialSuccess}
                                onCancel={() => setIsSocialDialogOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Platform</TableHead>
                                <TableHead>URL</TableHead>
                                <TableHead>Order</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {socialMedia.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                        <div className="text-muted-foreground">
                                            No social media links found. Add your first one!
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                socialMedia
                                    .sort((a, b) => a.order - b.order)
                                    .map((social) => (
                                        <TableRow key={social.id}>
                                            <TableCell>
                                                <div className="font-medium">{social.name}</div>
                                            </TableCell>
                                            <TableCell className="max-w-xs">
                                                <a
                                                    href={social.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline truncate block"
                                                >
                                                    {social.url}
                                                </a>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{social.order}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={social.isActive ? 'default' : 'secondary'}>
                                                    {social.isActive ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openSocialDialog(social)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="sm">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Delete Social Media</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Are you sure you want to delete this social media link? This action cannot be undone.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDeleteSocial(social.id)}
                                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                >
                                                                    Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}