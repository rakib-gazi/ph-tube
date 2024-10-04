const categories = async() => {
    const res = await fetch('https://openapi.programming-hero.com/api/phero-tube/categories');
    const data = await  res.json();
    return displayCategories(data.categories);
}
const video = async(searchText= '') => {
    const res = await fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`);
    const data = await  res.json();
    return displayVideos(data.videos);
}
const videosByCategories = async(id) =>{
    // const btnID =  document.getElementById(btn-{id});
    const res = await fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`);
    const data = await res.json();
        activeBtn();
        const btnID =  document.getElementById(`btn-${id}`);
        btnID.classList.add('bg-red-600', 'text-white');
        
    return displayVideos(data.category);
}
const videoDescription = async(videoID) =>{
    const  res = await fetch(`https://openapi.programming-hero.com/api/phero-tube/video/${videoID}`);
    const data = await res.json();
    return displayVideoDescription(data.video);
}
const displayVideoDescription =(videoData) =>{
    document.getElementById('customModal').showModal();
    const modalDetails = document.getElementById('modalContainer');
    modalDetails.innerHTML = `
        <img src=${videoData.thumbnail} class="h-full w-full object-cover" />
        <p class="pt-4" >${videoData.description}</p>
    `;

}
const timeCalculate = (time) =>{
    const year = parseInt(time/31536000);
    // const getMonth = parseInt((time%31536000)/2628000);
    const getMonth = time % 31536000;
    const month = parseInt(getMonth /2592000);
    const getDay =  getMonth % 2592000;
    const day = parseInt(getDay/86400);
    const getHour = getDay % 86400;
    const hour = parseInt(getHour /3600);
    const getMinute =  getHour % 3600;
    const minute = parseInt(getMinute/60);
    const Second = minute %  60;
    if(year >0){
        return `${year} years ago`
    }else if(year <= 0  && month > 0){
        return `${month} month ago`;
    }else if(year <= 0  && month <= 0 && day > 0 ){
        return `${day} day ago`;
    }else if (year <= 0   && month <= 0 && day <= 0 && hour > 0 ){
        return `${hour} : ${minute} : ${Second}`;
    }
    
}

const activeBtn = () =>{
    const buttons = document.querySelectorAll('.active-btn');
    for(let btn of buttons){
        btn.classList.remove('bg-red-600', 'text-white');
    }
}

const displayCategories = (btnCategory) =>{
    const categories = document.getElementById('categorie');
    btnCategory.forEach(item => {
        const btnContainer = document.createElement('div');
        btnContainer.innerHTML= `
        <button id="btn-${item.category_id}" onclick="videosByCategories(${item.category_id})" class="px-4 py-2  text-lg text-bold rounded-md btn  active-btn">${item.category}</button>`
        categories.appendChild(btnContainer);
    });
}
const displayVideos = (videos) => {
    const videoContainer = document.getElementById('videos');
    videoContainer.innerHTML = '';
    if(videos.length == 0){
        videoContainer.classList.remove('grid');
        videoContainer.innerHTML = `
            <div class="h-[300px] flex flex-col justify-center items-center" >
                <img src="icon.png"/>
                <p>Oops! No Content Here</p>
            </div>
            
        `;
    }else{
        videos.forEach(video => {
            videoContainer.classList.add('grid');
            const videoDiv = document.createElement('div');
            videoDiv.classList = ('card card-compact bg-base-100  shadow-xl');
            videoDiv.innerHTML = `
                <figure class="h-[200px] relative" >
                    <img
                    src=${video.thumbnail}
                    alt="Shoes" class="h-full w-full object-cover" />
                    ${video.others.posted_date?.length == '' ? '' : `<p class="bottom-2 right-2 bg-black text-white text-xs py-1 px-1.5 rounded absolute">${timeCalculate(video.others.posted_date)}</p>`}
                    
                </figure>
                <div class="card-body ">
                    <div class="flex justify-between">
                        <div class="w-1/5">
                            <img src=${video.authors[0].profile_picture} alt="" class="h-12 w-12 object-cover rounded-full">
                            
                        </div>
                        <div class="w-4/5">
                            <h2 class="text-xl font-bold">${video.title}</h2>
                            <p class="flex justify-normal items-center gap-2">
                                <span class="text-base font-semibold">${video.authors[0].profile_name}</span>
                                ${video.authors[0].verified === true ? '<img src="badge.png" alt="" class="h-4 w-4">' : ''}
                                
                            </p>
                            <p>${video.others.views} Views</p>
                            <button onclick ="videoDescription('${video.video_id}')" class="text-white rounded bg-red-600 px-2 py-1" >Details</button>
                        </div>
                    </div>
                </div>
            `
            videoContainer.append(videoDiv);
        })
    }
    
    
}
document.getElementById('search').addEventListener('keyup', (e)=>{
    video(e.target.value);
})
categories();
video();
