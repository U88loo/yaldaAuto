// Create main timeline
const mainTl = gsap.timeline();

// Split the text into individual characters
const splitText = new SplitText("h1", { type: "chars" });
const chars = splitText.chars;

// Initial setup - hide all characters
gsap.set(chars, { 
    opacity: 0, 
    y: -50
});

// Animate each character with a clear appearance
mainTl.to(chars, {
    duration: 0.8,
    opacity: 1,
    y: 0,
    stagger: {
        amount: 1,
        from: "random"
    },
    ease: "elastic.out(1, 0.3)",
    onComplete: () => {
        // Add a floating animation
        gsap.to(chars, {
            duration: "random(1.5, 2.5)",
            y: "random(-10, 10)",
            rotation: "random(-5, 5)",
            stagger: {
                amount: 1,
                from: "random"
            },
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
});

// Add scroll effect for the title
gsap.to("h1", {
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "+=500",
        scrub: true,
        pin: true,
        toggleActions: "play none none reverse"
    },
    scale: 0.8,
    y: "10vh",
    letterSpacing: "8px",
    textShadow: "0 0 40px rgba(46, 204, 113, 0.8)",
    ease: "power2.inOut",
    duration: 1
});

// Animate paragraphs
mainTl.from("p", {
    duration: 1,
    opacity: 0,
    y: 100,
    stagger: 0.3,
    ease: "power4.out"
}, "-=0.5");

// Add hover animations for nav links
gsap.utils.toArray(".navbar a").forEach(link => {
    link.addEventListener("mouseenter", () => {
        gsap.to(link, {
            duration: 0.3,
            scale: 1.2,
            color: "#2ecc71",
            background: "rgba(255, 255, 255, 0.2)",
            ease: "power2.out"
        });
    });
    
    link.addEventListener("mouseleave", () => {
        gsap.to(link, {
            duration: 0.3,
            scale: 1,
            color: "white",
            background: "transparent",
            ease: "power2.in"
        });
    });
});

// Title hover effect
const h1 = document.querySelector("h1");
const yalda = document.querySelector(".yalda");
const auto = document.querySelector(".auto");

// Create a timeline for hover effect
let hoverTl;

function initializeHoverEffects() {
    hoverTl = gsap.timeline({ paused: true });

    // Impressive hover animation for text only
    hoverTl
        .to(yalda, {
            duration: 0.3,
            scale: 1.1,
            color: "#00ffff",
            textShadow: "0 0 30px rgba(0, 255, 255, 0.9), 0 0 60px rgba(0, 255, 255, 0.7), 0 0 90px rgba(0, 255, 255, 0.5)",
            ease: "power2.out"
        })
        .to(auto, {
            duration: 0.3,
            scale: 1.05,
            color: "#2a2a2a",
            ease: "power2.out"
        }, "<");
}

// Enhanced text animation on hover
h1.addEventListener("mouseenter", (event) => {
    if (hoverTl) hoverTl.play();
});

h1.addEventListener("mouseleave", () => {
    if (hoverTl) hoverTl.reverse();
});

// Add parallax effect to title on mouse move
window.addEventListener('mousemove', (e) => {
    const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    
    gsap.to([yalda, auto], {
        duration: 0.5,
        x: mouseX * 20,
        y: mouseY * 10,
        rotationY: mouseX * 10,
        rotationX: -mouseY * 5,
        stagger: {
            amount: 0.2,
            from: "start"
        },
        ease: "power2.out"
    });
});

let scene, camera, renderer, model;
let isDragging = false;
let previousMouseX = 0;
let previousMouseY = 0;
let targetRotationY = Math.PI / 4;
let targetRotationX = 0;
let currentRotationY = Math.PI / 4;
let currentRotationX = 0;

// Navigation Three.js setup
let navScene, navCamera, navRenderer, navParticles;

function initNav() {
    navScene = new THREE.Scene();
    
    const navContainer = document.getElementById('nav-canvas');
    const navAspect = navContainer.clientWidth / navContainer.clientHeight;
    navCamera = new THREE.PerspectiveCamera(75, navAspect, 0.1, 1000);
    navCamera.position.z = 30;
    
    navRenderer = new THREE.WebGLRenderer({
        canvas: navContainer,
        alpha: true,
        antialias: true
    });
    navRenderer.setSize(navContainer.clientWidth, navContainer.clientHeight);
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 150;
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 50;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x00ffff,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    navParticles = new THREE.Points(particlesGeometry, particlesMaterial);
    navScene.add(navParticles);
    
    // Handle nav item hover with modern effects
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            gsap.to(particlesMaterial, {
                duration: 0.4,
                size: 0.08,
                opacity: 0.8,
                ease: "power2.out"
            });
            
            gsap.to(navParticles.rotation, {
                duration: 0.8,
                y: Math.PI * 0.1,
                ease: "power2.out"
            });
            
            // Add hover animation to other nav items
            navItems.forEach(otherItem => {
                if (otherItem !== item && !otherItem.classList.contains('active')) {
                    gsap.to(otherItem, {
                        duration: 0.3,
                        opacity: 0.4,
                        ease: "power2.out"
                    });
                }
            });
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(particlesMaterial, {
                duration: 0.4,
                size: 0.05,
                opacity: 0.6,
                ease: "power2.in"
            });
            
            gsap.to(navParticles.rotation, {
                duration: 0.8,
                y: 0,
                ease: "power2.inOut"
            });
            
            // Restore nav items opacity
            navItems.forEach(otherItem => {
                if (!otherItem.classList.contains('active')) {
                    gsap.to(otherItem, {
                        duration: 0.3,
                        opacity: 0.8,
                        ease: "power2.out"
                    });
                }
            });
        });
    });
    
    // Animate background gradient
    const gradient = document.querySelector('.background-gradient');
    gsap.to(gradient, {
        duration: 15,
        background: 'radial-gradient(circle at 60% 40%, rgba(8, 8, 20, 1) 0%, rgba(2, 2, 10, 1) 100%)',
        repeat: -1,
        yoyo: true,
        ease: "none"
    });
    
    // Enhanced mouse movement effect with subtle gradient shift
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Update gradient position slightly based on mouse
        gsap.to(gradient, {
            duration: 1,
            background: `radial-gradient(circle at ${50 + mouseX * 10}% ${50 + mouseY * 10}%, 
                rgba(8, 8, 20, 1) 0%, 
                rgba(2, 2, 10, 1) 100%)`,
            ease: "power2.out"
        });
    });
    
    function updateParticles() {
        targetX += (mouseX - targetX) * 0.1;
        targetY += (mouseY - targetY) * 0.1;
        
        if (navParticles) {
            gsap.to(navParticles.rotation, {
                duration: 1.5,
                x: targetY * 0.2,
                y: targetX * 0.2,
                ease: "power2.out"
            });
        }
        
        requestAnimationFrame(updateParticles);
    }
    
    updateParticles();
}

function animateNav() {
    requestAnimationFrame(animateNav);
    
    if (navParticles) {
        navParticles.rotation.y += 0.0005;
        navParticles.rotation.x += 0.0002;
    }
    
    navRenderer.render(navScene, navCamera);
}

// Navigation animations
function initNavAnimations() {
    // Initial animation for nav items
    const navItems = document.querySelectorAll('.nav-item');
    const logo = document.querySelector('.logo');
    
    // Create timeline for initial load animation
    const navTl = gsap.timeline({
        defaults: { ease: "power3.out" }
    });
    
    // Stagger nav items from top with glow effect
    navTl.from(navItems, {
        y: -50,
        opacity: 0,
        duration: 1,
        stagger: {
            amount: 0.8,
            from: "center"
        },
        filter: "blur(10px)"
    })
    .from(logo, {
        x: -50,
        opacity: 0,
        duration: 0.8,
        scale: 0.8,
        filter: "blur(10px)",
        ease: "back.out(1.7)"
    }, "-=0.5");

    // Hover animations for nav items
    navItems.forEach(item => {
        // Create hover timeline for each item
        const hoverTl = gsap.timeline({ paused: true });
        
        // Add glowing letter effect
        const letters = item.textContent.split('');
        item.textContent = '';
        letters.forEach(letter => {
            const span = document.createElement('span');
            span.textContent = letter;
            span.style.display = 'inline-block';
            item.appendChild(span);
        });
        
        const letterSpans = item.querySelectorAll('span');
        
        hoverTl
            .to(letterSpans, {
                duration: 0.3,
                y: -2,
                stagger: {
                    amount: 0.2,
                    from: "center"
                },
                ease: "power2.out"
            })
            .to(letterSpans, {
                duration: 0.2,
                color: "#00ffff",
                textShadow: "0 0 10px rgba(0, 255, 255, 0.5)",
                stagger: {
                    amount: 0.2,
                    from: "center"
                },
                ease: "power2.out"
            }, 0);
        
        // Add magnetic effect
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const distanceX = e.clientX - centerX;
            const distanceY = e.clientY - centerY;
            
            gsap.to(item, {
                duration: 0.3,
                x: distanceX * 0.1,
                y: distanceY * 0.1,
                ease: "power2.out"
            });
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                duration: 0.6,
                x: 0,
                y: 0,
                ease: "elastic.out(1, 0.3)"
            });
        });
        
        // Play/reverse hover animation
        item.addEventListener('mouseenter', () => {
            if (!item.classList.contains('active')) {
                hoverTl.play();
                
                // Dim other items
                navItems.forEach(otherItem => {
                    if (otherItem !== item && !otherItem.classList.contains('active')) {
                        gsap.to(otherItem, {
                            duration: 0.3,
                            opacity: 0.3,
                            scale: 0.95,
                            ease: "power2.out"
                        });
                    }
                });
            }
        });
        
        item.addEventListener('mouseleave', () => {
            if (!item.classList.contains('active')) {
                hoverTl.reverse();
                
                // Restore other items
                navItems.forEach(otherItem => {
                    if (!otherItem.classList.contains('active')) {
                        gsap.to(otherItem, {
                            duration: 0.3,
                            opacity: 0.8,
                            scale: 1,
                            ease: "power2.out"
                        });
                    }
                });
            }
        });
    });

    // Logo hover animation
    logo.addEventListener('mouseenter', () => {
        gsap.to(logo, {
            duration: 0.3,
            scale: 1.1,
            rotation: 5,
            filter: "drop-shadow(0 0 20px rgba(0, 255, 255, 0.6))",
            ease: "power2.out"
        });
    });

    logo.addEventListener('mouseleave', () => {
        gsap.to(logo, {
            duration: 0.5,
            scale: 1,
            rotation: 0,
            filter: "drop-shadow(0 0 10px rgba(0, 255, 255, 0.3))",
            ease: "elastic.out(1, 0.3)"
        });
    });

    // Scroll animation for nav bar
    let lastScroll = 0;
    const nav = document.querySelector('.nav-3d');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scrolling down
            gsap.to(nav, {
                duration: 0.3,
                yPercent: -100,
                ease: "power3.out"
            });
        } else {
            // Scrolling up
            gsap.to(nav, {
                duration: 0.3,
                yPercent: 0,
                ease: "power3.out"
            });
        }
        
        lastScroll = currentScroll;
    });
}

function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = null; // Make background transparent
    scene.fog = null; // Remove fog effect
    
    // Create camera with dynamic perspective
    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(30, aspect, 0.1, 1000);
    camera.position.set(0, -3, 40);
    camera.lookAt(0, -3, 0);
    
    // Create renderer with better quality
    renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
    });
    renderer.setClearColor(0x000000, 0); // Set clear color to transparent
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.8;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('model-container').appendChild(renderer.domElement);
    
    // Create neutral lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Main front light (white)
    const mainLight = new THREE.SpotLight(0xffffff, 2.5);
    mainLight.position.set(0, 8, 15);
    mainLight.angle = Math.PI / 3;
    mainLight.penumbra = 0.3;
    mainLight.decay = 1;
    mainLight.distance = 80;
    mainLight.castShadow = true;
    mainLight.shadow.bias = -0.0001;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    scene.add(mainLight);
    
    // Back rim light (white with slight cyan tint)
    const rimLight = new THREE.SpotLight(0xf0ffff, 1.5);
    rimLight.position.set(0, 5, -12);
    rimLight.angle = Math.PI / 3;
    rimLight.penumbra = 0.4;
    rimLight.decay = 1.5;
    rimLight.distance = 50;
    scene.add(rimLight);
    
    // Side accent lights
    const leftLight = new THREE.PointLight(0xffffff, 1.5, 40);
    leftLight.position.set(-12, 2, 0);
    scene.add(leftLight);
    
    const rightLight = new THREE.PointLight(0xffffff, 1.5, 40);
    rightLight.position.set(12, 2, 0);
    scene.add(rightLight);
    
    // Load 3D model
    const loader = new THREE.GLTFLoader();
    loader.load(
        '3dmodel.glb',
        function(gltf) {
            model3D = gltf.scene;
            scene.add(model3D);
            
            // Position model lower and make it smaller
            model3D.position.set(0, -8, 0);
            model3D.scale.set(1.2, 1.2, 1.2);
            
            // Keep original materials but enable shadows
            model3D.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    
                    if (child.material) {
                        child.material.envMapIntensity = 1;
                        child.material.needsUpdate = true;
                    }
                }
            });
            
            // Initialize hover effects after model is loaded
            initializeHoverEffects();
            
            // Dramatic entrance animation
            gsap.from(model3D.position, {
                duration: 2,
                y: -30,
                z: -40,
                ease: "power2.out"
            });
            
            gsap.from(model3D.rotation, {
                duration: 2.5,
                y: Math.PI * 2,
                ease: "power2.inOut"
            });
            
            gsap.from(model3D.scale, {
                duration: 2,
                x: 0,
                y: 0,
                z: 0,
                ease: "back.out(1.7)"
            });
        },
        function(xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function(error) {
            console.error('Error loading model:', error);
        }
    );
    
    // Event listener for window resize only
    window.addEventListener('resize', onWindowResize, false);
    
    animate();
    
    // Initialize navigation
    initNav();
    animateNav();
    
    // Initialize navigation animations
    initNavAnimations();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    if (model3D) {
        // Only keep smooth auto-rotation
        currentRotationY += 0.002;
        model3D.rotation.y = currentRotationY;
        
        // Floating animation
        const time = Date.now() * 0.0003;
        model3D.position.y = -8 + Math.sin(time) * 0.2;
    }
    
    renderer.render(scene, camera);
}

// Initialize parallax effect for the title
window.addEventListener('mousemove', (e) => {
    if (!chars) return;
    
    const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    
    gsap.to(chars, {
        duration: 0.5,
        x: mouseX * 20,
        y: mouseY * 10,
        rotationY: mouseX * 10,
        rotationX: -mouseY * 5,
        stagger: {
            amount: 0.3,
            from: "center"
        },
        ease: "power2.out"
    });
});


init();