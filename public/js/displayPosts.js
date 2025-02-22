export async function displayPosts() {
    console.log("displaying posts")

    let currentUser=null
    let posts = null

    try {
        // Wait for both authentication and posts to load
        const [authResponse, postsResponse] = await Promise.all([
            fetch("http://127.0.0.1:999/auth/verify", {
                method: "GET",
                credentials: "include"
            }),
            fetch("http://127.0.0.1:999/ads")
        ]);

        if (!authResponse.ok) {
            throw new Error("User not authenticated");
        }
        
        currentUser = await authResponse.json();
        
        if (!postsResponse.ok) {
            throw new Error("Failed to fetch posts");
        }
        
        posts = await postsResponse.json();

        const mainContainer = document.getElementById('mainContainer');
        if (!mainContainer) {
            throw new Error("Main container not found");
        }

        mainContainer.classList.add("postsContainer");
        mainContainer.innerHTML = '';

        posts.forEach(post => {
            const card = document.createElement('div');
            card.className = 'card';
            card.id=post._id

            // Now we can safely check authorization since currentUser is guaranteed to exist
            const isAuthorized = currentUser.role === 'admin' || currentUser._id === post.user;

            const isValidUrl = (urlString) => {
                try {
                    return Boolean(new URL(urlString));
                } catch (e) {
                    return false;
                }
            };

            const imageUrl = post.link && isValidUrl(post.link)
                ? post.link
                : `https://placehold.co/600x400?text=${encodeURIComponent(post.title || 'No Image')}`;

            card.innerHTML = `
                <div class="card-image">
                    <img src="${imageUrl}" alt="${post.title}">
                </div>
                <div class="card-header">
                    <h2>${post.title}</h2>
                    ${post.createdAt ? `<p class="date">${new Date(post.createdAt).toLocaleDateString()}</p>` : ''}
                </div>
                <div class="card-content"><p>${post.description}</p></div>
                <div class="card-footer"><p class="price">${post.price.toLocaleString()} €</p></div>
                <div class="card-controls">
                    ${isAuthorized ? `
                        <button type="button" class="edit-btn" data-post-id="${post._id}">Edit</button>
                        <button type="button" class="delete-btn" data-post-id="${post._id}">Delete</button>
                    ` : `
                        <button type="button" class="favorite-btn" data-post-id="${post._id}" id="fav-${post._id}">♡ Favorite</button>
                    `}
                </div>
            `;
            mainContainer.appendChild(card);
            
        });

       


    } catch (error) {
        console.error("Error in displayPosts:", error);
        // You might want to show an error message to the user here
    }
}
 // Add event listeners after all cards are created
        mainContainer.addEventListener('click', (event) => {
            const postId = event.target.dataset.postId;
            if (!postId) return;
            event.preventDefault()
            if (event.target.classList.contains('delete-btn')) deletePost(postId);
            if (event.target.classList.contains('edit-btn')) editPost(postId);
            if (event.target.classList.contains('favorite-btn')) toggleFavorite(postId);
        });

window.deletePost = deletePost;
window.editPost = editPost;
window.toggleFavorite = toggleFavorite;

// Handler functions for the buttons
async function deletePost(postId) {
  if (confirm('Are you sure you want to delete this post?')) {
    try {
      const response = await fetch(`http://127.0.0.1:999/ads/${postId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Remove the post from UI
        document.querySelector(`[data-post-id="${postId}"]`).remove();
        displayPosts()
        alert("Post deleted!")
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  }
}

let currentlyEditingPostId=null
function editPost(postId) {
    currentlyEditingPostId=postId
  const targetCard=document.getElementById(postId)

   // Get current values
    const currentTitle = targetCard.querySelector('.card-header h2')?.textContent;
    const currentDesc = targetCard.querySelector('.card-content p')?.textContent;
    const currentPrice = targetCard.querySelector('.card-footer .price')?.textContent.replace(/[^0-9]/g, '');
    const currentImage = targetCard.querySelector('.card-image img')?.src;
    
    //DEBUG
    console.log("Current Title:", currentTitle);
    console.log("Current Description:", currentDesc);
    console.log("Current Price:", currentPrice);
    console.log("Current Image:", currentImage);
    console.log("target Card:", targetCard.outerHTML)

    //DEBUG

    // Create image input and preview container
    const imageContainer = targetCard.querySelector('.card-image');
    imageContainer.textContent = ''; // Clear existing
    
    const imageInput = document.createElement('input');
    imageInput.type = 'url';
    imageInput.value = currentImage;
    imageInput.className = 'edit-image';
    imageInput.placeholder = 'Enter image URL';
    
    // Create preview image
    const imagePreview = document.createElement('img');
    imagePreview.src = currentImage;
    imagePreview.alt = 'Preview';
    
    // Update preview when URL changes
    imageInput.addEventListener('change', (e) => {
        imagePreview.src = e.target.value;
    });
    
    imageContainer.appendChild(imagePreview);
    imageContainer.appendChild(imageInput);
    
    // Rest of the edit form (title, description, price)
    let titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.value = currentTitle;
    titleInput.className = 'edit-title';
    
    const descTextarea = document.createElement('textarea');
    descTextarea.value = currentDesc;
    descTextarea.className = 'edit-description';
    
    const priceInput = document.createElement('input');
    priceInput.type = 'number';
    priceInput.value = currentPrice;
    priceInput.className = 'edit-price';
    
    // Clear and append elements
    const titleContainer = targetCard.querySelector('.card-header h2');
    titleContainer.textContent = '';
    titleContainer.appendChild(titleInput);
    
    const descContainer = targetCard.querySelector('.card-content p');
    descContainer.textContent = '';
    descContainer.appendChild(descTextarea);
    
    const priceContainer = targetCard.querySelector('.card-footer .price');
    priceContainer.textContent = '';
    priceContainer.appendChild(priceInput);

    
    // Create control buttons
    const controls = targetCard.querySelector('.card-controls');
    controls.textContent = '';
    
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.className = 'save-btn';
    saveBtn.addEventListener('click',async(e)=>{
        console.log("save button clicked")
        try {
        const response = await fetch(`http://127.0.0.1:999/ads/${postId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            credentials:"include",
            body: JSON.stringify({
                title:titleInput.value,
                description:descTextarea.value,
                price:priceInput.value,
                link:imageInput.value
            })
        });

        if (!response.ok) {
            throw new Error("Failed to update ad");
        }

        const updatedAd = await response.json();
        console.log("Ad updated successfully:", updatedAd);
        //return updatedAd;
        currentlyEditingPostId=null
        await displayPosts()
    } catch (error) {
        console.error("Error updating ad:", error);
    }
    })
    
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.className = 'cancel-btn';
    cancelBtn.addEventListener("click",async()=>{
        currentlyEditingPostId=null
        await displayPosts()
    })
    
    controls.appendChild(saveBtn);
    controls.appendChild(cancelBtn);
    console.log("edit btn fnc end")
}

async function toggleFavorite(postId) {
  const favBtn = document.getElementById(`fav-${postId}`);
  try {
    const response = await fetch(`/api/posts/${postId}/favorite`, {
      method: 'POST',
    });
    if (response.ok) {
      // Toggle favorite status in UI
      favBtn.classList.toggle('favorited');
      favBtn.textContent = favBtn.classList.contains('favorited') ? '♥ Favorited' : '♡ Favorite';
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    alert('Failed to update favorite status');
  }
}