const loginForm = document.getElementById('login-form')
loginForm.addEventListener('submit', async (e)=>{
    e.preventDefault()
    const loginEmail = loginForm['login-email'].value
    const loginPassword = loginForm['login-password'].value

    try{
        let creds = await auth.signInWithEmailAndPassword(loginEmail, loginPassword)
        console.log(creds, 'Sucess')
        location = 'index.html'
    } catch(err){
        console.error(err)
    }
    
})