document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('urlInput');
    const crawlButton = document.getElementById('crawlButton');
    const loading = document.getElementById('loading');
    const resultsSection = document.getElementById('resultsSection');
    const errorSection = document.getElementById('errorSection');
    
    // Backend API URL - adjust this to match your backend URL
    const API_URL = 'http://localhost:8082';
    
    crawlButton.addEventListener('click', crawlUrl);
    urlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            crawlUrl();
        }
    });
    
    function crawlUrl() {
        const url = urlInput.value.trim();
        
        if (!url) {
            showError('Please enter a URL');
            return;
        }
        
        // Basic URL validation
        try {
            new URL(url);
        } catch (e) {
            showError('Please enter a valid URL (e.g., https://example.com)');
            return;
        }
        
        // Show loading, hide results and error
        loading.style.display = 'block';
        resultsSection.style.display = 'none';
        errorSection.style.display = 'none';
        
        fetch(`${API_URL}/urls`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.error || 'Failed to crawl URL');
                });
            }
            return response.json();
        })
        .then(data => {
            displayResults(data.result);
        })
        .catch(error => {
            showError(error.message);
        })
        .finally(() => {
            loading.style.display = 'none';
        });
    }
    
    function displayResults(result) {
        // Update the UI with the results
        document.getElementById('resultTitle').textContent = result.title || 'No Title';
        
        const statusBadge = document.getElementById('resultStatus');
        statusBadge.textContent = result.status || 'unknown';
        statusBadge.className = 'status-badge ' + (result.status || 'unknown');
        
        document.getElementById('htmlVersion').textContent = result.html_version || 'Unknown';
        document.getElementById('h1Count').textContent = result.h1_count || 0;
        document.getElementById('h2Count').textContent = result.h2_count || 0;
        document.getElementById('h3Count').textContent = result.h3_count || 0;
        document.getElementById('h4Count').textContent = result.h4_count || 0;
        document.getElementById('h5Count').textContent = result.h5_count || 0;
        document.getElementById('h6Count').textContent = result.h6_count || 0;
        document.getElementById('internalLinks').textContent = result.internal_links || 0;
        document.getElementById('externalLinks').textContent = result.external_links || 0;
        document.getElementById('brokenLinks').textContent = result.broken_links ? result.broken_links.length : 0;
        document.getElementById('hasLoginForm').textContent = result.has_login_form ? 'Yes' : 'No';
        
        // Display broken links if any
        const brokenLinksSection = document.getElementById('brokenLinksSection');
        const brokenLinksList = document.getElementById('brokenLinksList');
        
        if (result.broken_links && result.broken_links.length > 0) {
            brokenLinksList.innerHTML = '';
            result.broken_links.forEach(link => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${link.url}</strong> - Status: ${link.status_code}`;
                brokenLinksList.appendChild(li);
            });
            brokenLinksSection.style.display = 'block';
        } else {
            brokenLinksSection.style.display = 'none';
        }
        
        resultsSection.style.display = 'block';
    }
    
    function showError(message) {
        errorSection.textContent = message;
        errorSection.style.display = 'block';
    }
});