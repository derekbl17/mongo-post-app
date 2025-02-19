export const simpleRole=()=>{
    const header=document.getElementById("header")
    const container=document.getElementById("mainContainer")

    const addPostBtn=document.createElement("button")
    addPostBtn.innerText="Add Post"

    container.innerText="SIMPLE USER"
    header.append(addPostBtn)

    addPostBtn.addEventListener("click",(e)=>{
        container.innerHTML=""
        const fieldNames=["Name","Category","Description","Price, eur","Image link"]

        const existingForm = document.getElementById("addPostForm");
        if (existingForm) {
        existingForm.remove()
        }
        const form=document.createElement("form")
        form.id="addPostForm"
        container.append(form)

        for (let x of fieldNames){
            console.log(x);
            const label=document.createElement("label")
            label.innerText=`${x}`
            // fetch categories from DB and add each one as an option in select
            if (x==="Category"){
                const select=document.createElement("select")
                ///////
                onValue(ref(db, 'categories/'), (snapshot) => {
                    const data = snapshot.val();
                    const option=document.createElement("option")
                    option.innerText="Choose category"
                    option.value=""
                    select.append(option)
                    console.log(data);
                    for(let k in data){
                        const option=document.createElement("option")
                        option.innerText=k
                        option.value=k
                        select.append(option)
                    }
                })
                // add an ID based off category
                select.id=`addPostField${x.slice(0,3)}`
                label.setAttribute("for",select.id)
                form.append(label,select)

            } else{
                const input=document.createElement("input")
                input.id=`addPostField${x.slice(0,3)}`
                label.setAttribute("for",input.id)
                form.append(label,input)
            }
        }
        // declare ALL INPUT FIELDS and a button to submit form
        const postButton=document.createElement("button")
        const addPostFieldNam=document.getElementById("addPostFieldNam")
        const addPostFieldCat=document.getElementById("addPostFieldCat")
        const addPostFieldDes=document.getElementById("addPostFieldDes")
        const addPostFieldPri=document.getElementById("addPostFieldPri")
        const addPostFieldIma=document.getElementById("addPostFieldIma")
        postButton.innerText="Post!"
        postButton.addEventListener("click",(e)=>{
            e.preventDefault()
            console.log("POST!!!");
            // add post fields check
            if (addPostFieldCat.value.trim() && addPostFieldNam.value.trim() && addPostFieldDes.value.trim() && addPostFieldPri.value.trim() && addPostFieldIma.value.trim()){
                console.log("all Filled");
                // ADD POST if all fields filled
                set(push(ref(db, "posts/" + auth.currentUser.uid)), {
                        name: addPostFieldNam.value,
                        category: addPostFieldCat.value,
                        description: addPostFieldDes.value,
                        price: addPostFieldPri.value,
                        imageLink: addPostFieldIma.value
                      }).then(()=>{
                        alert("successfully posted!");
                        
                      })
                // if all fields !filled vvvvvv         
            } else{
                console.log("no value somewhere..");
            }
        })
        form.append(postButton)
    })
}