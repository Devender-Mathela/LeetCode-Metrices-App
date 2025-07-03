document.addEventListener("DOMContentLoaded",function(){

    const searchButton=document.getElementById("search-btn");
    const usernameInput=document.getElementById("user-input");
    const statsContainer=document.querySelector(".stats-container");
    const easyProgressCircle=document.querySelector(".easy-progress");
    const mediumProgressCircle=document.querySelector(".medium-progress");
    const hardProgressCircle=document.querySelector(".hard-progress");
    const easylabel=document.getElementById("easy-label");
    const mediumlabel=document.getElementById("medium-label");
    const hardlabel=document.getElementById("hard-label");
    const cardStatsContainer=document.querySelector(".stats-cards");

    //return true or false based on a regex
    function validateusername(username){
        if(username.trim()===""){
            alert("Username should not be empty")
            return false;
        }
        const regex= /^[a-zA-Z][a-zA-Z0-9_.-]{2,14}$/;
        const isMatching=regex.test(username);
        if(!isMatching){
            alert("Invalid Username");
        }
        return isMatching;

    }

    async function fetchUserDetails(username) {
        
        try{
            searchButton.textContent="Searching....."
            searchButton.disabled=true;

            // const response=await fetch(url);
            const proxyUrl=`https://cors-anywhere.herokuapp.com/`    //proxy-URL
            const targeturl=`https://leetcode.com/grpahql/`

            //concatenated url:https://cors-anywhere.herokuapp.com/https://leetcode.com/grpahql/

            const myHeaders=new Headers();
            myHeaders.append("content-type","applicaiton/json");

            const graphql=JSON.stringify({
                query:"\n query userSessionProgress($username: String!) {\n allQuestionsCount {\n difficulty\n count\n }\n matchUser (username:$username) {\n submitStats {\n acSubmissionNum {\n difficulty\n count\n submission\n } \n totalSubmissionNum {\n difficulty\n count\n submissions\n }\n }\n}\n}\n ",variables:{"username":"tarun-joshi"}
            })
            const requestOption={
                method:"Post",
                headers:myHeaders,
                body:graphql,
                redirect:"follow"

            };

            const response=await fetch(proxyUrl+targeturl,requestOption);
            if(!response){
                throw new Error("Unable to fetch the user details")
            }
            const parseData=await response.json();
            console.log("parseData")

            displayUserData(parseData);
        }
        catch(error){
            statsContainer.innerHTML=`<p>${error.message}</p>`
        }  
        finally{
            searchButton.textContent="Search"
            searchButton.disabled=true;
        }
    }

    function updateProgress(solved,total,label,circle){
        const progressDegree=(solved/total*100);
        circle.style.setProperty("--progress-degree",`${progressDegree}%`);
        label.textContent=`${solved}/${total}`;
    }

    function displayUserData(parseData){
        const totalQues=parseData.data.allQuestionsCount[0].count;
        const totalEasyQues=parseData.data.allQuestionsCount[1].count;
        const totalMedQues=parseData.data.allQuestionsCount[2].count;
        const totalHardQues=parseData.data.allQuestionsCount[3].count;

        const solvedTotalQues=parseData.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const solvedTotalEasyQues=parseData.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const solvedTotalMedQues=parseData.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const solvedTotalHardQues=parseData.data.matchedUser.submitStats.acSubmissionNum[3].count;

        
        updateProgress(solvedTotalEasyQues,totalEasyQues,easylabel,easyProgressCircle);
        updateProgress(solvedTotalMedQues,totalMedQues,mediumlabel,mediumProgressCircle);
        updateProgress(solvedTotalHardQues,totalHardQues,hardlabel,hardProgressCircle);

        const cardsData=[
            {label:"Overall Submissions",value:parseData.data.matchedUser.submitStats.totalSubmissionNum[0].submission},
            {label:"Overall Easy Submissions",value:parseData.data.matchedUser.submitStats.totalSubmissionNum[1].submission},
            {label:"Overall Medium Submissions",value:parseData.data.matchedUser.submitStats.totalSubmissionNum[2].submission},
            {label:"Overall Hard Submissions",value:parseData.data.matchedUser.submitStats.totalSubmissionNum[3].submission}
        ];

        cardStatsContainer.innerHTML=cardsData.map(
            data=>{
                return `<div class="card">
                    <h4>${data.label}</h4>
                    <p>${data.value}</p>
                </div>`
            }
        ).join("")

    }

    searchButton.addEventListener("click",function(){
        const username=usernameInput.value;
        console.log("logging username:",username);
        
        if(validateusername(username)){
            fetchUserDetails(username)
        }
    })
})
