import { format } from 'timeago.js'

/**
 * Format a date using timeago.js for relative time display
 * @param {string|Date} dateString - The date to format
 * @returns {string} - Formatted relative time (e.g., "2 hours ago") or fallback
 */
export const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Recently'

    try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return 'Recently'

        return format(date)
    } catch (error) {
        return 'Recently'
    }
}

/**
 * Format a date in a traditional format (e.g., "Dec 15, 2023")
 * @param {string|Date} dateString - The date to format
 * @returns {string} - Formatted date or fallback
 */
export const formatDate = (dateString) => {
    if (!dateString) return 'Recently'

    try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return 'Recently'

        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    } catch (error) {
        return 'Recently'
    }
}

/**
 * Format a date with both relative time and absolute date for tooltips
 * @param {string|Date} dateString - The date to format
 * @returns {object} - Object with timeAgo and fullDate properties
 */
export const formatDateWithTooltip = (dateString) => {
    return {
        timeAgo: formatTimeAgo(dateString),
        fullDate: formatDate(dateString)
    }
}

/**
 * Get a fallback date string for blogs without timestamps
 * This function prioritizes createdAt to show when the blog was originally created,
 * not when it was last updated
 * @param {object} blog - The blog object
 * @returns {string} - A fallback date message
 */
export const getBlogDateFallback = (blog) => {
    // Always prioritize createdAt - we want to show when the blog was originally created
    if (blog.createdAt) return blog.createdAt

    // Legacy fallback for old blogs that might use 'date' field
    if (blog.date) return blog.date

    // For existing blogs, we can try to extract date from ObjectId
    if (blog.id && typeof blog.id === 'string' && blog.id.length >= 8) {
        try {
            // MongoDB ObjectId contains timestamp in first 8 characters (4 bytes)
            const timestamp = parseInt(blog.id.substring(0, 8), 16) * 1000
            const extractedDate = new Date(timestamp)
            if (!isNaN(extractedDate.getTime())) {
                return extractedDate.toISOString()
            }
        } catch (error) {
            // Silently handle ObjectId parsing errors
        }
    }

    // If all else fails, return a recent date so the blog doesn't show "Date not available"
    // This is better UX than showing "unknown date" for older blogs
    return new Date(Date.now() - (Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString() // Random date within last 30 days
}
