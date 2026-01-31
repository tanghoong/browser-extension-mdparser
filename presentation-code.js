  /**
   * Phase 5: Presentation Mode Manager
   */
  const PresentationManager = {
    slides: [],
    currentSlide: 0,
    isActive: false,
    canvas: null,
    ctx: null,
    isDrawing: false,
    drawColor: '#ff0000',
    drawMode: 'pen',
    laserPointerActive: false,
    
    detectSlides(markdown) {
      // Split by horizontal rules (--- or ***)
      const slideContents = markdown.split(/\n---+\n|\n\*\*\*+\n/);
      return slideContents.filter(content => content.trim().length > 0);
    },
    
    hasSlides(markdown) {
      return this.detectSlides(markdown).length > 1;
    },
    
    createPresentationButton() {
      const btn = document.createElement('button');
      btn.className = 'presentation-mode-btn';
      btn.innerHTML = '📊 Presentation Mode';
      btn.title = 'Enter presentation mode';
      
      btn.addEventListener('click', () => this.enterPresentationMode());
      
      document.body.appendChild(btn);
      return btn;
    },
    
    async enterPresentationMode() {
      this.isActive = true;
      this.currentSlide = 0;
      
      // Render all slides
      await this.renderSlides();
      
      // Create presentation UI
      this.createPresentationUI();
      
      // Setup navigation
      this.setupNavigation();
      
      // Hide normal UI elements
      this.hideNormalUI();
      
      // Show first slide
      this.showSlide(0);
    },
    
    async renderSlides() {
      const slideElements = document.querySelectorAll('.presentation-slide');
      this.slides = Array.from(slideElements);
    },
    
    createPresentationUI() {
      // Create overlay
      const overlay = document.createElement('div');
      overlay.className = 'presentation-overlay';
      document.body.appendChild(overlay);
      
      // Create slide counter
      const counter = document.createElement('div');
      counter.className = 'slide-counter';
      counter.textContent = `1 / ${this.slides.length}`;
      overlay.appendChild(counter);
      
      // Create toolbar
      const toolbar = document.createElement('div');
      toolbar.className = 'presentation-toolbar';
      toolbar.innerHTML = `
        <button class="pres-nav-btn" data-action="prev" title="Previous (← or Click Left)">◀</button>
        <button class="pres-nav-btn" data-action="next" title="Next (→ or Click Right/Space)">▶</button>
        <button class="pres-tool-btn" data-tool="pen" title="Pen Tool">✏️</button>
        <button class="pres-tool-btn" data-tool="highlighter" title="Highlighter">🖍️</button>
        <button class="pres-tool-btn" data-tool="laser" title="Laser Pointer">🔴</button>
        <button class="pres-action-btn" data-action="clear" title="Clear Drawings">🗑️</button>
        <button class="pres-action-btn" data-action="exit" title="Exit (ESC)">❌</button>
      `;
      overlay.appendChild(toolbar);
      
      // Setup toolbar events
      toolbar.querySelectorAll('.pres-nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const action = e.currentTarget.getAttribute('data-action');
          if (action === 'prev') this.previousSlide();
          if (action === 'next') this.nextSlide();
        });
      });
      
      toolbar.querySelectorAll('.pres-tool-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const tool = e.currentTarget.getAttribute('data-tool');
          this.activateTool(tool);
          
          // Visual feedback
          toolbar.querySelectorAll('.pres-tool-btn').forEach(b => b.classList.remove('active'));
          e.currentTarget.classList.add('active');
        });
      });
      
      toolbar.querySelectorAll('.pres-action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const action = e.currentTarget.getAttribute('data-action');
          if (action === 'clear') this.clearDrawing();
          if (action === 'exit') this.exitPresentationMode();
        });
      });
      
      // Create drawing canvas
      this.canvas = document.createElement('canvas');
      this.canvas.className = 'presentation-canvas';
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      overlay.appendChild(this.canvas);
      
      this.ctx = this.canvas.getContext('2d');
      this.setupDrawing();
      
      // Create laser pointer
      const laser = document.createElement('div');
      laser.className = 'laser-pointer';
      laser.style.display = 'none';
      overlay.appendChild(laser);
    },
    
    setupNavigation() {
      // Keyboard navigation
      this.keyHandler = (e) => {
        if (!this.isActive) return;
        
        switch(e.key) {
          case 'ArrowRight':
          case ' ':
          case 'PageDown':
            e.preventDefault();
            this.nextSlide();
            break;
          case 'ArrowLeft':
          case 'PageUp':
            e.preventDefault();
            this.previousSlide();
            break;
          case 'Home':
            e.preventDefault();
            this.showSlide(0);
            break;
          case 'End':
            e.preventDefault();
            this.showSlide(this.slides.length - 1);
            break;
          case 'Escape':
            e.preventDefault();
            this.exitPresentationMode();
            break;
        }
      };
      
      document.addEventListener('keydown', this.keyHandler);
      
      // Mouse navigation
      this.clickHandler = (e) => {
        if (!this.isActive) return;
        if (e.target.closest('.presentation-toolbar')) return;
        if (this.isDrawing) return;
        
        const clickX = e.clientX;
        const halfWidth = window.innerWidth / 2;
        
        if (clickX > halfWidth) {
          this.nextSlide();
        } else {
          this.previousSlide();
        }
      };
      
      document.addEventListener('click', this.clickHandler);
    },
    
    setupDrawing() {
      let lastX = 0;
      let lastY = 0;
      
      this.canvas.addEventListener('mousedown', (e) => {
        if (!this.isActive || this.laserPointerActive) return;
        if (this.drawMode === 'pen' || this.drawMode === 'highlighter') {
          this.isDrawing = true;
          lastX = e.offsetX;
          lastY = e.offsetY;
        }
      });
      
      this.canvas.addEventListener('mousemove', (e) => {
        if (this.laserPointerActive) {
          const laser = document.querySelector('.laser-pointer');
          laser.style.left = e.clientX + 'px';
          laser.style.top = e.clientY + 'px';
          return;
        }
        
        if (!this.isDrawing) return;
        
        this.ctx.beginPath();
        this.ctx.moveTo(lastX, lastY);
        this.ctx.lineTo(e.offsetX, e.offsetY);
        
        if (this.drawMode === 'pen') {
          this.ctx.strokeStyle = this.drawColor;
          this.ctx.lineWidth = 3;
          this.ctx.globalAlpha = 1;
        } else if (this.drawMode === 'highlighter') {
          this.ctx.strokeStyle = '#ffff00';
          this.ctx.lineWidth = 20;
          this.ctx.globalAlpha = 0.3;
        }
        
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.stroke();
        
        lastX = e.offsetX;
        lastY = e.offsetY;
      });
      
      this.canvas.addEventListener('mouseup', () => {
        this.isDrawing = false;
        this.ctx.globalAlpha = 1;
      });
      
      this.canvas.addEventListener('mouseleave', () => {
        this.isDrawing = false;
      });
    },
    
    activateTool(tool) {
      if (tool === 'laser') {
        this.laserPointerActive = !this.laserPointerActive;
        const laser = document.querySelector('.laser-pointer');
        laser.style.display = this.laserPointerActive ? 'block' : 'none';
        this.canvas.style.cursor = this.laserPointerActive ? 'none' : 'crosshair';
      } else {
        this.laserPointerActive = false;
        document.querySelector('.laser-pointer').style.display = 'none';
        this.drawMode = tool;
        this.canvas.style.cursor = 'crosshair';
      }
    },
    
    clearDrawing() {
      if (this.ctx) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    },
    
    showSlide(index) {
      if (index < 0 || index >= this.slides.length) return;
      
      // Hide all slides
      this.slides.forEach(slide => {
        slide.style.display = 'none';
      });
      
      // Show current slide
      this.currentSlide = index;
      this.slides[index].style.display = 'block';
      
      // Update counter
      const counter = document.querySelector('.slide-counter');
      if (counter) {
        counter.textContent = `${index + 1} / ${this.slides.length}`;
      }
      
      // Clear drawings
      this.clearDrawing();
      
      // Stop all media
      stopAllMedia();
      
      // Scroll to top
      window.scrollTo(0, 0);
    },
    
    nextSlide() {
      if (this.currentSlide < this.slides.length - 1) {
        this.showSlide(this.currentSlide + 1);
      }
    },
    
    previousSlide() {
      if (this.currentSlide > 0) {
        this.showSlide(this.currentSlide - 1);
      }
    },
    
    hideNormalUI() {
      const elementsToHide = [
        '.md-parser-badge',
        '.toc-sidebar',
        '.scroll-to-top',
        '.tts-toolbar',
        '.presentation-mode-btn'
      ];
      
      elementsToHide.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
          element.style.display = 'none';
        }
      });
    },
    
    showNormalUI() {
      const elementsToShow = [
        '.md-parser-badge',
        '.scroll-to-top',
        '.tts-toolbar',
        '.presentation-mode-btn'
      ];
      
      elementsToShow.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
          element.style.display = '';
        }
      });
      
      const toc = document.querySelector('.toc-sidebar');
      if (toc) {
        toc.style.display = 'block';
      }
    },
    
    exitPresentationMode() {
      this.isActive = false;
      
      // Remove event listeners
      if (this.keyHandler) {
        document.removeEventListener('keydown', this.keyHandler);
      }
      if (this.clickHandler) {
        document.removeEventListener('click', this.clickHandler);
      }
      
      // Show all slides
      this.slides.forEach(slide => {
        slide.style.display = 'block';
      });
      
      // Remove presentation UI
      const overlay = document.querySelector('.presentation-overlay');
      if (overlay) {
        overlay.remove();
      }
      
      // Show normal UI
      this.showNormalUI();
      
      // Reset state
      this.currentSlide = 0;
      this.canvas = null;
      this.ctx = null;
      this.laserPointerActive = false;
    }
  };

  /**
   * Split container into slides for presentation mode
   */
  function prepareSlides(container, markdown) {
    if (!PresentationManager.hasSlides(markdown)) {
      return;
    }
    
    const slideContents = PresentationManager.detectSlides(markdown);
    
    // Clear container
    container.innerHTML = '';
    
    // Render each slide
    slideContents.forEach((slideMarkdown, index) => {
      const slideDiv = document.createElement('div');
      slideDiv.className = 'presentation-slide';
      slideDiv.setAttribute('data-slide-index', index);
      
      const slideHtml = renderMarkdown(slideMarkdown);
      slideDiv.innerHTML = slideHtml;
      
      container.appendChild(slideDiv);
    });
    
    // Create presentation mode button
    PresentationManager.createPresentationButton();
  }
