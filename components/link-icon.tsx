import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaGithub, 
  FaYoutube, 
  FaTiktok, 
  FaTwitch, 
  FaSpotify 
} from 'react-icons/fa'
import { Globe } from 'lucide-react'

export function LinkIcon({ url, className = "h-5 w-5" }: { url: string | null, className?: string }) {
  if (!url) return <Globe className={className} />

  const lowerUrl = url.toLowerCase()

  if (lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.com')) return <FaFacebook className={className} />
  if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) return <FaTwitter className={className} />
  if (lowerUrl.includes('instagram.com')) return <FaInstagram className={className} />
  if (lowerUrl.includes('linkedin.com')) return <FaLinkedin className={className} />
  if (lowerUrl.includes('github.com')) return <FaGithub className={className} />
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) return <FaYoutube className={className} />
  if (lowerUrl.includes('tiktok.com')) return <FaTiktok className={className} />
  if (lowerUrl.includes('twitch.tv')) return <FaTwitch className={className} />
  if (lowerUrl.includes('spotify.com')) return <FaSpotify className={className} />

  return <Globe className={className} />
}
