(function() {
    'use strict';



    gsap.registerPlugin(ScrollTrigger);

    const initJourney = () => {
        const journey = document.getElementById('goldenTalonJourney');
        const svg = document.getElementById('journeySvg');
        const basePath = document.getElementById('journeyPathBase');
        const trailPath = document.getElementById('journeyPathTrail');
        const nodesGroup = document.getElementById('journeyNodes');
        const orb = document.getElementById('journeyOrb');
        const cards = Array.from(document.querySelectorAll('.ctf-card'));

        if (!journey || !svg || !basePath || !trailPath || !orb || cards.length === 0) {
            return;
        }

        let pathLength = 0;
        let currentProgress = 0;
        let nodeProgresses = [];
        let scrollTriggerInstance = null;
        let isAnimating = false;

        const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

        function smoothPath(points) {
            if (!points.length) return '';
            if (points.length === 1) return `M ${points[0].x},${points[0].y}`;

            let path = `M ${points[0].x},${points[0].y}`;

            for (let i = 0; i < points.length - 1; i++) {
                const current = points[i];
                const next = points[i + 1];
                
                const dx = next.x - current.x;
                const dy = next.y - current.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                const midY = (current.y + next.y) / 2;
                const cp1x = current.x;
                const cp1y = current.y + dy * 0.4;
                const cp2x = next.x;
                const cp2y = next.y - dy * 0.4;

                path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`;
            }

            return path;
        }

        function findClosestProgress(targetX, targetY) {
            if (!pathLength) return 0;

            let closestDist = Infinity;
            let closestProgress = 0;
            const samples = 400;

            for (let i = 0; i <= samples; i++) {
                const progress = i / samples;
                const point = basePath.getPointAtLength(pathLength * progress);
                const dist = Math.hypot(point.x - targetX, point.y - targetY);

                if (dist < closestDist) {
                    closestDist = dist;
                    closestProgress = progress;
                }
            }

            return closestProgress;
        }

        function updateOrbPosition(progress) {
            if (!pathLength) return;

            const p = clamp(progress, 0, 1);
            currentProgress = p;

            const point = basePath.getPointAtLength(pathLength * p);
            orb.style.transform = `translate(${point.x}px, ${point.y}px)`;


            const traveledLength = pathLength * p;
            trailPath.style.strokeDasharray = `${traveledLength} ${pathLength - traveledLength}`;
            trailPath.style.strokeDashoffset = '0';
        }

        function buildPath() {
            const journeyRect = journey.getBoundingClientRect();
            const width = journeyRect.width;
            const height = journeyRect.height;
            const centerX = width / 2;
            
            const amplitude = Math.min(width * 0.15, 120);

            svg.setAttribute('width', width);
            svg.setAttribute('height', height);
            svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

            const cardPoints = cards.map((card, index) => {
                const rect = card.getBoundingClientRect();
                const relativeY = rect.top - journeyRect.top + rect.height / 2;
                const isLeft = card.classList.contains('left');
                const offsetX = isLeft ? -amplitude : amplitude;

                return {
                    x: centerX + offsetX,
                    y: relativeY,
                    element: card
                };
            });

            if (cardPoints.length === 0) return;

            const startPoint = {
                x: centerX,
                y: Math.max(10, cardPoints[0].y - 100)
            };

            const endPoint = {
                x: centerX,
                y: Math.min(height - 10, cardPoints[cardPoints.length - 1].y + 100)
            };

            const allPoints = [startPoint, ...cardPoints, endPoint];
            const pathData = smoothPath(allPoints);

            basePath.setAttribute('d', pathData);
            trailPath.setAttribute('d', pathData);

            pathLength = basePath.getTotalLength();
            
            nodeProgresses = cardPoints.map(point => 
                findClosestProgress(point.x, point.y)
            );

            drawNodes();

            updateOrbPosition(currentProgress);
        }

        function drawNodes() {
            if (!nodesGroup) return;
            
            nodesGroup.innerHTML = '';

            nodeProgresses.forEach((progress, index) => {
                const point = basePath.getPointAtLength(pathLength * progress);
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', point.x);
                circle.setAttribute('cy', point.y);
                circle.setAttribute('r', '4');
                circle.setAttribute('class', 'journey-node');
                nodesGroup.appendChild(circle);
            });
        }


        function highlightCard(card) {
            cards.forEach(c => c.classList.remove('is-focused'));
            if (card) {
                card.classList.add('is-focused');
            }
        }

        function animateToCard(index) {
            const card = cards[index];
            if (!card || index >= nodeProgresses.length) return;

            isAnimating = true;
            const targetProgress = nodeProgresses[index];
            const distance = Math.abs(targetProgress - currentProgress);
            const duration = Math.min(1.8, Math.max(0.6, distance * 2));

            gsap.to({ progress: currentProgress }, {
                progress: targetProgress,
                duration: duration,
                ease: 'power2.inOut',
                onUpdate: function() {
                    updateOrbPosition(this.targets()[0].progress);
                },
                onComplete: () => {
                    isAnimating = false;
                    pulseOrb();
                    highlightCard(card);
                }
            });
        }

        function initScrollTrigger() {
            if (scrollTriggerInstance) {
                scrollTriggerInstance.kill();
            }

            scrollTriggerInstance = ScrollTrigger.create({
                trigger: journey,
                start: 'top center',
                end: 'bottom center',
                scrub: 0.2,
                onUpdate: (self) => {
                    if (!isAnimating) {
                        updateOrbPosition(self.progress);
                        
                        let nearestIndex = 0;
                        let nearestDist = Infinity;
                        nodeProgresses.forEach((nodeP, idx) => {
                            const dist = Math.abs(nodeP - self.progress);
                            if (dist < nearestDist) {
                                nearestDist = dist;
                                nearestIndex = idx;
                            }
                        });
                        highlightCard(cards[nearestIndex]);
                    }
                }
            });
        }

        cards.forEach((card, index) => {
            card.addEventListener('click', (e) => {
                animateToCard(index);
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });

            });
        });

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                buildPath();
                if (scrollTriggerInstance) {
                    ScrollTrigger.refresh();
                }
            }, 150);
        });


        buildPath();
        initScrollTrigger();
        updateOrbPosition(0);
        highlightCard(cards[0]);

        setTimeout(() => {
            buildPath();
            ScrollTrigger.refresh();
        }, 100);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initJourney);
    } else {
        initJourney();
    }
})();
