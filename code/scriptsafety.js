let USER = 'sofiawillebrand'
let PROJECT = 'project-weather-app'
let API_PROFILE = `https://api.github.com/users/${USER}`
let API_ALL_REPOS = `https://api.github.com/users/${USER}/repos`
let REPO_API = `https://api.github.com/repos/${USER}/${PROJECT}/commits`
let repoContainer = document.getElementById('repo-container')
let profileContainer = document.getElementById('profile-container')
let repositorys = {}

// const getProfile = () => {
//   fetch(API_PROFILE)
//   .then(res => res.json()) 
//   .then(profileData => {
//     profileContainer.innerHTML += /*html*/`
//       <img src=${profileData.avatar_url} class="profile-img">    
//       <h1>${profileData.name}</h1>
//     `
//     });
// }

const insertRepoInfo = (repositorys) => {
  for(let key in repositorys) {
    repoContainer.innerHTML += /*html*/ `
      <div class="repo-card">
        <h3>${key}</h3>
        <p>Date of latest push: ${repositorys[key].latest_push}</p>
        <p>Default branch: ${repositorys[key].default_branch}</p>
        <p>Latest commit-message: ${repositorys[key].commit_message}</p>
        <p>Number of commits: ${repositorys[key].number_commits}</p>
        <a>Link to GitHub repo: ${repositorys[key].project_url}</a>
      </div>
    `
  }
}

const getRepos = () => {
  fetch(API_ALL_REPOS)
  .then(res => res.json()) 
  .then(async reposData => {
    console.log('Repodata: ', reposData)
    const technigoRepos = reposData.filter((repo) => repo.fork && repo.name.startsWith('project-'))
    for(let i=0; i<technigoRepos.length; i++){
      let project = technigoRepos[i]
      let latestPush = new Date(project.pushed_at).toDateString()
      repositorys[`${project.name}`] = {}
      repositorys[`${project.name}`]["latest_push"] = `${latestPush}`
      repositorys[`${project.name}`]["default_branch"] = `${project.default_branch}`
      repositorys[`${project.name}`]["project_url"] = `${project.html_url}`

      let REPO_API = `https://api.github.com/repos/${USER}/${project.name}/commits`
        await fetch(REPO_API)
        .then(res => res.json()) 
        .then(commitData => {
          let commitMessage = commitData[0].commit.message
      
          let repository = repositorys[project.name]
          repository["commit_message"] = `${commitMessage}`
          repository["number_commits"] = `${commitData.length}`
        })
    }
    insertRepoInfo(repositorys)
  })
}
//getRepos()
// getProfile()

// create dynamic ID from for eaxmple the name of the project 
// avoid using global variables
// use info about reponame to get element from dynamic id and update innerhtml


const insertRepoInfo2 = (projectName, latestPush, defaultBranch, projectUrl, commitMessage, numberOfCommits) => { 
    repoContainer.innerHTML += /*html*/ `
      <div class="repo-card">
        <h3>${projectName}</h3>
        <p>Date of latest push: ${latestPush}</p>
        <p>Default branch: ${defaultBranch}</p>
        <p>Latest commit-message: ${commitMessage}</p>
        <p>Number of commits: ${numberOfCommits}</p>
        <a>Link to GitHub repo: ${projectUrl}</a>
      </div>
    `
}

const getRepos2 = () => {
  fetch(API_ALL_REPOS)
  .then(res => res.json()) 
  .then(reposData => {
    console.log('Repodata: ', reposData)
    const technigoRepos = reposData.filter((repo) => repo.fork && repo.name.startsWith('project-'))
    for(let i=0; i<technigoRepos.length; i++){
      let project = technigoRepos[i]
      let latestPush = new Date(project.pushed_at).toDateString()
      //repositorys[`${project.name}`] = {}
      //repositorys[`${project.name}`]["latest_push"] = `${latestPush}`
      //repositorys[`${project.name}`]["default_branch"] = `${project.default_branch}`
      //repositorys[`${project.name}`]["project_url"] = `${project.html_url}`

      let REPO_API = `https://api.github.com/repos/${USER}/${project.name}/commits`
      fetch(REPO_API)
      .then(res => res.json()) 
      .then(commitData => {
        let commitMessage = commitData[0].commit.message
    
        //let repository = repositorys[project.name]
        //repository["commit_message"] = `${commitMessage}`
        //repository["number_commits"] = `${commitData.length}`
        insertRepoInfo2(project.name, latestPush, project.default_branch, project.html_url, commitMessage, commitData.length)
      })
    }
  })
}


getRepos2()