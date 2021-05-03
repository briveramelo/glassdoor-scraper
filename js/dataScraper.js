function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function saveToCsv(ratings)
{
    console.log(`FINAL: allRatings Length: ${ratings.length}`);
    console.log(ratings);
    let csvContent = "data:text/csv;charset=utf-8," + ratings.join(",");
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    let companyLabel=document.getElementsByTagName('h1')[0].innerText.replace(/\s+/g, '');
    link.setAttribute("download", `Glassdoor_${companyLabel}.csv`);
    document.body.appendChild(link);
    link.click();
}

function getRatings()
{
    let ratingsElements = document.getElementsByClassName('ratingNumber mr-xsm');
    let ratings=[];
    for (let i = 0; i < ratingsElements.length; i++){
        let text = ratingsElements[i].innerText;
        let rating = parseInt(text).toString();
        ratings.push(rating);
    }
    return ratings;
}

async function tryMoveToNextPage(timeToLoad_ms)
{
    let nextButton = document.getElementsByClassName('nextButton css-sed91k')[0];
    if(nextButton && !nextButton.disabled)
    {
        nextButton.click();
        await sleep(timeToLoad_ms);
        return true;
    }
    return false;
}

async function collectData()
{
    let allRatings = [];
    let isThereAnotherPage = true;
    while(isThereAnotherPage)
    {
        let newRatings = getRatings();
        allRatings.push(...newRatings);

        isThereAnotherPage = await tryMoveToNextPage(3000);
    }
    saveToCsv(allRatings);
}

//assumes that you start on the company's first reviews page
collectData();