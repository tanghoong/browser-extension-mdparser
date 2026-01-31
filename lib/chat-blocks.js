/**
 * Chat Blocks Library
 * Slack and Discord styled chat message blocks
 */

(function() {
  'use strict';

  // Chat block manager
  window.ChatBlockManager = {
    init: function() {
      this.processChatBlocks();
    },

    processChatBlocks: function() {
      // Find all code blocks with chat languages
      const codeBlocks = document.querySelectorAll('pre code.language-slack, pre code.language-discord');
      
      codeBlocks.forEach(block => {
        const isSlack = block.classList.contains('language-slack');
        const isDiscord = block.classList.contains('language-discord');
        
        if (isSlack || isDiscord) {
          this.convertToChatBlock(block, isSlack ? 'slack' : 'discord');
        }
      });
    },

    convertToChatBlock: function(codeBlock, type) {
      const content = codeBlock.textContent;
      const messages = this.parseMessages(content);
      
      // Create chat container
      const chatContainer = document.createElement('div');
      chatContainer.className = `chat-block chat-${type}`;
      
      // Add messages
      messages.forEach(msg => {
        const messageEl = this.createMessage(msg, type);
        chatContainer.appendChild(messageEl);
      });
      
      // Replace the code block with chat block
      const pre = codeBlock.closest('pre');
      if (pre && pre.parentNode) {
        pre.parentNode.replaceChild(chatContainer, pre);
      }
    },

    parseMessages: function(content) {
      const messages = [];
      const lines = content.trim().split('\n');
      let currentMessage = null;

      lines.forEach(line => {
        // Match message format: [username] message or [username|time] message
        const match = line.match(/^\[([^\]|]+)(?:\|([^\]]+))?\]\s*(.+)$/);
        
        if (match) {
          if (currentMessage) {
            messages.push(currentMessage);
          }
          
          currentMessage = {
            username: match[1].trim(),
            time: match[2] ? match[2].trim() : this.getCurrentTime(),
            message: match[3].trim(),
            avatar: this.generateAvatar(match[1].trim())
          };
        } else if (currentMessage && line.trim()) {
          // Multi-line message
          currentMessage.message += '\n' + line;
        }
      });

      if (currentMessage) {
        messages.push(currentMessage);
      }

      return messages;
    },

    createMessage: function(msg, type) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `chat-message chat-message-${type}`;
      
      // Avatar
      const avatar = document.createElement('div');
      avatar.className = 'chat-avatar';
      avatar.style.backgroundColor = msg.avatar.color;
      avatar.textContent = msg.avatar.initials;
      
      // Content wrapper
      const contentWrapper = document.createElement('div');
      contentWrapper.className = 'chat-content';
      
      // Header (username + time)
      const header = document.createElement('div');
      header.className = 'chat-header';
      
      const username = document.createElement('span');
      username.className = 'chat-username';
      username.textContent = msg.username;
      
      const time = document.createElement('span');
      time.className = 'chat-time';
      time.textContent = msg.time;
      
      header.appendChild(username);
      header.appendChild(time);
      
      // Message body
      const body = document.createElement('div');
      body.className = 'chat-body';
      
      // Process message content (supports markdown-like syntax)
      body.innerHTML = this.formatMessage(msg.message);
      
      contentWrapper.appendChild(header);
      contentWrapper.appendChild(body);
      
      messageDiv.appendChild(avatar);
      messageDiv.appendChild(contentWrapper);
      
      return messageDiv;
    },

    formatMessage: function(text) {
      // Simple formatting for chat messages
      return text
        // Code blocks: `code`
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        // Bold: *text*
        .replace(/\*([^*]+)\*/g, '<strong>$1</strong>')
        // Italic: _text_
        .replace(/_([^_]+)_/g, '<em>$1</em>')
        // Links: [text](url)
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
        // Mentions: @username
        .replace(/@(\w+)/g, '<span class="chat-mention">@$1</span>')
        // Channels: #channel
        .replace(/#(\w+)/g, '<span class="chat-channel">#$1</span>')
        // Line breaks
        .replace(/\n/g, '<br>');
    },

    generateAvatar: function(username) {
      // Generate color based on username
      const colors = [
        '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3',
        '#00bcd4', '#009688', '#4caf50', '#ff9800', '#ff5722'
      ];
      
      let hash = 0;
      for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
      }
      
      const colorIndex = Math.abs(hash) % colors.length;
      const initials = username.substring(0, 2).toUpperCase();
      
      return {
        color: colors[colorIndex],
        initials: initials
      };
    },

    getCurrentTime: function() {
      const now = new Date();
      return now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    }
  };

})();
