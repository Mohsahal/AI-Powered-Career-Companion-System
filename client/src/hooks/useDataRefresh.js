import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
/**
 * Custom hook to refresh data when navigating back to a specific route
 * @param targetPath - The path to watch for navigation back
 * @param refreshCallback - Function to call when navigating back
 * @param dependencies - Additional dependencies for the effect
 */
export const useDataRefresh = (targetPath, refreshCallback, dependencies = []) => {
    const location = useLocation();
    const lastPathRef = useRef(location.pathname);
    useEffect(() => {
        if (location.pathname === targetPath) {
            // Check if we're actually navigating back to this page
            if (lastPathRef.current !== targetPath) {
                console.log(`Navigated back to ${targetPath}, refreshing data...`);
                refreshCallback();
            }
            lastPathRef.current = location.pathname;
        }
    }, [location.pathname, targetPath, refreshCallback, ...dependencies]);
    // Refresh data when user returns to the browser tab
    useEffect(() => {
        const handleFocus = () => {
            if (location.pathname === targetPath) {
                console.log(`User returned to tab on ${targetPath}, refreshing data...`);
                refreshCallback();
            }
        };
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && location.pathname === targetPath) {
                console.log(`Page ${targetPath} became visible, refreshing data...`);
                refreshCallback();
            }
        };
        window.addEventListener('focus', handleFocus);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            window.removeEventListener('focus', handleFocus);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [location.pathname, targetPath, refreshCallback, ...dependencies]);
};
