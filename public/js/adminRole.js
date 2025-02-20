const container=document.getElementById("mainContainer")
async function displayCategories() {
    try {
        const response = await fetch("http://127.0.0.1:999/category");
        const categories = await response.json();
        
        const existingForm = document.getElementById("CATEGORIES");
        if (existingForm) {
            existingForm.remove();
        }

        const categoryListForm = document.createElement("form");
        categoryListForm.id = "CATEGORIES";
        container.append(categoryListForm);

        categories.forEach(category => {
            const categoryContainer = document.createElement("div");
            categoryContainer.id = `categoryList`;
            
            const categoryName = document.createElement("h5");
            categoryName.innerText = category.name;
            
            const categoryDelBtn = document.createElement("button");
            categoryDelBtn.className = 'removeCategory';
            categoryDelBtn.innerText = "Remove";
            
            categoryContainer.append(categoryName, categoryDelBtn);
            categoryListForm.append(categoryContainer);

            categoryDelBtn.addEventListener("click", async (e) => {
                e.preventDefault();
                try {
                    const response = await fetch(`http://127.0.0.1:999/category/${category._id}`, {
                        method: "DELETE"
                    });
                    
                    if (response.ok) {
                        alert(`Category ${category.name} removed.`);
                        displayCategories(); // Refresh the list
                    } else {
                        const error = await response.json();
                        alert(`Error: ${error.message}`);
                    }
                } catch (error) {
                    console.error("Error deleting category:", error);
                    alert("Failed to delete category");
                }
            });
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
}};
async function displayUsers() {
    try {
        container.innerHTML=""
        const response = await fetch("http://127.0.0.1:999/users");
        const users = await response.json();
        
        const existingTable = document.getElementById("USERS_TABLE");
        if (existingTable) {
            existingTable.remove();
        }

        // Create table
        const table = document.createElement("table");
        table.id = "USERS_TABLE";
        table.className = "users-table";

        // Create header
        const thead = document.createElement("thead");
        thead.innerHTML = `
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
            </tr>
        `;
        table.appendChild(thead);

        // Create table body
        const tbody = document.createElement("tbody");
        
        users.forEach(user => {
            const tr = document.createElement("tr");
            const createdAt = new Date(user.createdAt).toLocaleDateString();
            
            tr.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.isBlocked ? '<span class="blocked">Blocked</span>' : '<span class="active">Active</span>'}</td>
                <td>${createdAt}</td>
                <td class="action-buttons"></td>
            `;

            // Create action buttons
            const actionCell = tr.querySelector('.action-buttons');
            
            // Block/Unblock button
            const blockBtn = document.createElement("button");
            blockBtn.className = user.isBlocked ? 'unblock-btn' : 'block-btn';
            blockBtn.innerText = user.isBlocked ? 'Unblock' : 'Block';
            
            // Delete button
            const deleteBtn = document.createElement("button");
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerText = 'Delete';

            actionCell.append(blockBtn, deleteBtn);
            tbody.appendChild(tr);

            // Block/Unblock handler
            blockBtn.addEventListener("click", async () => {
                try {
                    const response = await fetch(`http://127.0.0.1:999/users/${user._id}/toggle-block`, {
                        method: "PUT"
                    });
                    
                    if (response.ok) {
                        const result = await response.json();
                        alert(result.message);
                        displayUsers(); // Refresh the list
                    } else {
                        const error = await response.json();
                        alert(`Error: ${error.message}`);
                    }
                } catch (error) {
                    console.error("Error toggling user block status:", error);
                    alert("Failed to update user status");
                }
            });

            // Delete handler
            deleteBtn.addEventListener("click", async () => {
                if (confirm(`Are you sure you want to delete user ${user.username}?`)) {
                    try {
                        const response = await fetch(`http://127.0.0.1:999/users/${user._id}`, {
                            method: "DELETE"
                        });
                        
                        if (response.ok) {
                            alert(`User ${user.username} deleted successfully`);
                            displayUsers(); // Refresh the list
                        } else {
                            const error = await response.json();
                            alert(`Error: ${error.message}`);
                        }
                    } catch (error) {
                        console.error("Error deleting user:", error);
                        alert("Failed to delete user");
                    }
                }
            });
        });

        table.appendChild(tbody);
        document.getElementById("mainContainer").appendChild(table);

    } catch (error) {
        console.error("Error fetching users:", error);
        alert("Failed to load users");
    }
}

export const adminRole=()=>{
    let currentUser=null
    fetch("http://127.0.0.1:999/auth/verify",{
        method: "GET",
        credentials: "include"
    })
    .then((res)=>{
        if(res.ok) return res.json();
        else throw new Error("User not authenticated")
    })
    .then(user=>{
        console.log(user)
        currentUser=user
    })
    const header=document.getElementById("header")
    container.innerText="ADMIN"
    const createCategoryBtn=document.createElement("button")
    createCategoryBtn.innerText="Create category"
    const showUsersBtn=document.createElement("button")
    showUsersBtn.innerText="Show users"
    showUsersBtn.addEventListener("click",(e)=>{
        e.preventDefault()
        displayUsers()
    })
    const showPostsBtn=document.createElement("button")
    showPostsBtn.innerText="Show posts"
    header.append(createCategoryBtn,showUsersBtn,showPostsBtn)

    showPostsBtn.addEventListener("click",async(e)=>{
        container.innerHTML=""
        try{
            const response = await fetch("http://127.0.0.1:999/ads")
            if(response.ok){
                const posts = await response.json()
                console.log(posts)
                displayPosts(posts,currentUser)
            }
        }catch(error){
            console.log("error fetching posts", error)
        }
        

    })

    createCategoryBtn.addEventListener("click",(e)=>{
        e.preventDefault()
        container.innerHTML=""
        const addCatForm = document.createElement("form");
        addCatForm.id ="addCatForm"
        const label = document.createElement("label");
        label.innerText = "Category name";
        const input = document.createElement("input");
        const addCatBtn = document.createElement("button");
        addCatBtn.innerText = "Add new category";
        addCatForm.append(label, input, addCatBtn);
        container.append(addCatForm);
        console.log("ADMIN NEW CATEGORY");
        displayCategories()
        
        addCatBtn.addEventListener("click",async(e)=>{
            e.preventDefault();
            console.log("add new category");
            const name=input.value
            console.log(name)
            if(name){
                try{
                    const response = await fetch("http://127.0.0.1:999/category", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",

                },
                body: JSON.stringify({name:name}),
            });
            const result = await response.json();
            console.log(result);
            displayCategories()
                }catch(error){
                    console.log(error)
                }
            }else console.log("no category entered")
        })
    })
}

// function displayPosts(posts, currentUser) {
//   const mainContainer = document.getElementById('mainContainer');
  
//   // Clear any existing content
//   mainContainer.innerHTML = '';
//   mainContainer.classList.add("postsContainer")

  
  
//   // Create cards for each post
//   posts.forEach(post => {
//     const card = document.createElement('div');
//     card.className = 'card';

//     const isAuthorized = 
//       currentUser.role === 'admin' || 
//       currentUser.id === post.user;
    
//     // Create card content
//     let cardHTML = '';
    
//     // Add image if available
//     const isValidUrl = (urlString) => {
//         try {
//             return Boolean(new URL(urlString));
//         } catch (e) {
//             return false;
//     }
//     };
    
//     // Use placeholder if link is missing or invalid
//     const imageUrl = isValidUrl(post.link) 
//       ? post.link 
//       : `https://placehold.co/600x400?text=${encodeURIComponent(post.title || 'No Image')}`;
    

    
//     // Add post details
//     cardHTML += `
//       <div class="card-image">
//         <img src="${imageUrl}" alt="${post.title}" 
//           onerror="this.onerror=null; this.src='https://placehold.co/600x400?text=Error+Loading+Image';">
//       </div>
//     `;
    
//     cardHTML += `
//       <div class="card-header">
//         <h2>${post.title}</h2>
//         ${post.createdAt ? `<p class="date">${new Date(post.createdAt).toLocaleDateString()}</p>` : ''}
//       </div>
//       <div class="card-content">
//         <p>${post.description}</p>
//       </div>
//       <div class="card-footer">
//         <p class="price">${post.price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR'})}</p>
//       </div>
//     `;
    
    
//     card.innerHTML = cardHTML;
//     mainContainer.appendChild(card);
//   });
// }


/////////TODO move displayPosts with button functions to a different file, use it in simple users post display, make the edit work, add delete ad route with all, look into favorites 
function displayPosts(posts, currentUser) {
  const mainContainer = document.getElementById('mainContainer');
  mainContainer.classList.add("postsContainer")
  
  // Clear any existing content
  mainContainer.innerHTML = '';
  
  posts.forEach(post => {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-post-id', post._id);

    // Check if user is author or admin
    const isAuthorized = currentUser.role === 'admin' || currentUser.id === post.user;
    
    
    
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
            <button class="edit-btn" data-post-id="${post._id}">Edit</button>
            <button class="delete-btn" data-post-id="${post._id}">Delete</button>
          ` : `
            <button class="favorite-btn" data-post-id="${post._id}" id="fav-${post._id}">♡ Favorite</button>
          `}
        </div>
    `;

    
    mainContainer.appendChild(card);
  });
  mainContainer.addEventListener('click', (event) => {
    const postId = event.target.dataset.postId;
    if (!postId) return;
    if (event.target.classList.contains('delete-btn')) deletePost(postId);
    if (event.target.classList.contains('edit-btn')) editPost(postId);
    if (event.target.classList.contains('favorite-btn')) toggleFavorite(postId);
  });
}

window.deletePost = deletePost;
window.editPost = editPost;
window.toggleFavorite = toggleFavorite;

// Handler functions for the buttons
async function deletePost(postId) {
  if (confirm('Are you sure you want to delete this post?')) {
    try {
      const response = await fetch(`/api/ads/${postId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Remove the post from UI
        document.querySelector(`[data-post-id="${postId}"]`).remove();
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  }
}

function editPost(postId) {
  // Redirect to edit page or open edit modal
  window.location.href = `/edit-post/${postId}`;
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

// Usage example:
// const currentUser = {
//   id: '67b5b5c2f00e9b5cdee74600',  // Replace with actual user ID
//   role: 'user'  // Replace with actual user role
// };
