
const getUserInfoFromToken = () => {
    const token = localStorage.getItem('Newtoken');
  
    if (!token) {
      return null; // Token not found
    }
  
    try {
      // Decode the token
      //const decodedToken = jwt.decode(token, { complete: true });

      // https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library, used a couple times
    const parseJwt = (token) => {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }
    
      // loggedin user
      const decodedToken = parseJwt(token)
  
      // Extract user information from the decoded token
      const email = decodedToken.email;
      const nickname = decodedToken.nickname;
      const isVerified = decodedToken.isVerified;
      const isAdmin = decodedToken.isAdmin;
  
      return {
        email,
        nickname,
        isVerified,
        isAdmin
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null; // Error decoding token
    }
  };
  
  export default getUserInfoFromToken;

  //AI PROMPT: write me a function that i can use to access the token from local storage, decode it, and extract the users nickname, verified status, admin status
