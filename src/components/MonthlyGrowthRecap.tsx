import React, { useEffect, useRef, useCallback } from 'react';
import './MonthlyGrowthRecap.css'; // Import the CSS

// Import images (adjust paths if necessary)
import physicalImg from '/assets/recap_phy.png';
import economicImg from '/assets/recap.eco.png';
import emotionalImg from '/assets/prayer_pose_nobg.png';
import mentalImg from '/assets/recap.men.png';
import gratitudeImg from '/assets/happy.png';

// Define the structure for section data (optional but good practice)
interface SectionData {
    type: 'physical' | 'economic' | 'emotional' | 'mental' | 'gratitude';
    imageSrc: string;
    imageAlt: string;
    stats: { label: string; value: string }[];
    title: string;
    summaryLine1: string;
    summaryHighlight1: string;
    summaryLine2: string;
    summaryHighlight2?: string; // Optional second highlight
    summaryLine3: string;
}

// Data for sections - makes the JSX cleaner
const sectionsData: SectionData[] = [
    {
        type: 'physical',
        imageSrc: physicalImg,
        imageAlt: 'Physical Growth',
        stats: [
            { label: 'Workouts Completed', value: '20' },
            { label: 'Distance Run', value: '50km' },
            { label: 'Consistency Rate', value: '95%' },
        ],
        title: 'Physical Growth',
        summaryLine1: 'You completed ',
        summaryHighlight1: '20 morning workouts',
        summaryLine2: ' and ran ',
        summaryHighlight2: '50km',
        summaryLine3: ' this month.<br/>Your consistency and endurance are on fire!',
    },
    {
        type: 'economic',
        imageSrc: economicImg,
        imageAlt: 'Economic Growth',
        stats: [
            { label: 'Savings', value: '₹8,000' },
            { label: 'Extra Income', value: '₹5,000' },
            { label: 'Budget Adherence', value: '92%' },
        ],
        title: 'Economic Growth',
        summaryLine1: 'You saved ',
        summaryHighlight1: '₹8,000',
        summaryLine2: ' and earned an extra ',
        summaryHighlight2: '₹5,000',
        summaryLine3: ' from freelancing.<br/>Your budgeting and side hustle game is strong.',
    },
    {
        type: 'emotional',
        imageSrc: emotionalImg,
        imageAlt: 'Emotional Growth',
        stats: [
            { label: 'Journal Entries', value: '28' },
            { label: 'Meditation Minutes', value: '420' },
            { label: 'Emotional Balance', value: '85%' },
        ],
        title: 'Emotional Growth',
        summaryLine1: 'You ',
        summaryHighlight1: 'journaled consistently',
        summaryLine2: ' and stayed calm during tough conversations.',
        summaryLine3: '<br/>Emotional mastery is showing.',
    },
    {
        type: 'mental',
        imageSrc: mentalImg,
        imageAlt: 'Mental Growth',
        stats: [
            { label: 'Books Read', value: '3' },
            { label: 'Study Hours', value: '45' },
            { label: 'Focus Score', value: '88%' },
        ],
        title: 'Mental Growth',
        summaryLine1: 'You finished ',
        summaryHighlight1: '3 books',
        summaryLine2: ' and learned the basics of ',
        summaryHighlight2: 'Python',
        summaryLine3: '.<br/>Deep focus and learning have been your strength.',
    },
    {
        type: 'gratitude',
        imageSrc: gratitudeImg,
        imageAlt: 'Gratitude Moment',
        stats: [
            { label: 'Acts of Kindness', value: '12' },
            { label: 'Thank You Notes', value: '8' },
            { label: 'Gratitude Score', value: '98%' },
        ],
        title: 'Gratitude Moment',
        summaryLine1: 'You surprised your ',
        summaryHighlight1: 'parents with a dinner',
        summaryLine2: ' and messaged your ',
        summaryHighlight2: 'mentor',
        summaryLine3: '.<br/>You embraced gratitude wholeheartedly.',
    },
];


const MonthlyGrowthRecap: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    // --- Intersection Observer Logic ---
    useEffect(() => {
        const sections = containerRef.current?.querySelectorAll('section');
        if (!sections) return;

        // Get color scheme from CSS variables (run once)
        const rootStyles = getComputedStyle(document.documentElement);
        const colorSchemes = {
          physical: rootStyles.getPropertyValue('--physical-accent').trim(),
          economic: rootStyles.getPropertyValue('--economic-accent').trim(),
          emotional: rootStyles.getPropertyValue('--emotional-accent').trim(),
          mental: rootStyles.getPropertyValue('--mental-accent').trim(),
          gratitude: rootStyles.getPropertyValue('--gratitude-accent').trim()
        };

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                const section = entry.target as HTMLElement; // Type assertion
                if (entry.isIntersecting) {
                    const type = section.dataset.type as keyof typeof colorSchemes; // Type assertion
                    if (type && colorSchemes[type]) {
                         document.documentElement.style.setProperty('--current-accent', colorSchemes[type]);
                    }
                    section.classList.add('in-view');
                } else {
                    section.classList.remove('in-view');
                }
            });
        }, {
            root: null, // Use viewport as root
            rootMargin: '-40% 0px -40% 0px', // Same trigger points as original
            threshold: 0 // Trigger as soon as element enters/leaves margin
        });

        sections.forEach(section => observer.observe(section));

        // Cleanup function
        return () => {
            sections.forEach(section => observer.unobserve(section));
            observer.disconnect();
        };
    }, []); // Empty dependency array: runs only once on mount

    // --- Parallax Scroll Logic ---
    useEffect(() => {
        let ticking = false;
        let parallaxElements: NodeListOf<HTMLElement> | null = null; // Cache elements

        const getParallaxElements = () => {
            if (!parallaxElements) {
                 // Query within the component's container for better scoping
                parallaxElements = containerRef.current?.querySelectorAll('.parallax');
            }
            return parallaxElements;
        }

        const applyParallax = () => {
            const elements = getParallaxElements();
            if (!elements) return;

            const scrollY = window.scrollY;
            const viewportHeight = window.innerHeight;

            elements.forEach(el => {
                // Ensure element is still in DOM and visible (basic check)
                if (!el.isConnected) return;

                const rect = el.getBoundingClientRect();
                 // Skip calculations if element is completely out of view for performance
                if (rect.bottom < 0 || rect.top > viewportHeight) {
                    // Optional: Reset transform if needed when out of view
                    // el.style.transform = 'translateY(0px)';
                    return;
                }

                const elCenter = rect.top + rect.height / 2;
                const viewportCenter = viewportHeight / 2;
                const distance = elCenter - viewportCenter;
                const factor = parseFloat(el.dataset.parallaxFactor || '0'); // Default factor to 0
                const translateY = distance * factor;

                // Direct style manipulation for performance critical scroll events
                // Adding a small amount of easing via JS can sometimes feel smoother than CSS transitions fighting it
                // Example: lerp(currentTransformY, targetTranslateY, 0.1) - but adds complexity.
                // Stick to direct application for now.
                el.style.transform = `translateY(${translateY.toFixed(2)}px)`;
            });

            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(applyParallax);
                ticking = true;
            }
        };

        // Initial calculation on mount
        getParallaxElements(); // Find elements initially
        requestAnimationFrame(applyParallax); // Apply parallax on load

        // Add smooth scroll class for CSS
        document.documentElement.classList.add('smooth-scroll');
        window.addEventListener('scroll', onScroll, { passive: true });

        // Cleanup function
        return () => {
            window.removeEventListener('scroll', onScroll);
            document.documentElement.classList.remove('smooth-scroll');
             // Optional: Reset transforms on unmount if elements persist somehow (unlikely in standard React flow)
             // const elements = getParallaxElements();
             // elements?.forEach(el => el.style.transform = '');
        };
    }, []); // Empty dependency array: runs only once on mount and cleanup on unmount


    return (
        <div className="recap-container" ref={containerRef}>
            {sectionsData.map((section) => (
                <section key={section.type} data-type={section.type} className="flex items-stretch">
                    <div className="slide-content">
                        <div className="stats-overlay parallax" data-parallax-factor="0.05">
                            {section.stats.map(stat => (
                                <div className="stat-item" key={stat.label}>
                                    {stat.label}: <span className="stat-value">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                        <h2 className="parallax" data-parallax-factor="0.1">
                            {section.title}
                        </h2>
                        <p
                            className="slide-summary parallax"
                            data-parallax-factor="0.03"
                            // Use dangerouslySetInnerHTML for <br/> tags from data
                            dangerouslySetInnerHTML={{ __html:
                                `${section.summaryLine1}<span class="highlight">${section.summaryHighlight1}</span>${section.summaryLine2}` +
                                (section.summaryHighlight2 ? `<span class="highlight">${section.summaryHighlight2}</span>` : '') +
                                `${section.summaryLine3}`
                            }}
                        />
                    </div>
                    <div className="slide-image-wrapper">
                        <img
                            src={section.imageSrc}
                            alt={section.imageAlt}
                            className="slide-image parallax"
                            data-parallax-factor="-0.15"
                            loading="lazy"
                        />
                    </div>
                </section>
            ))}
        </div>
    );
};

export default MonthlyGrowthRecap;