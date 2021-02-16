async function fetchDonationData(){
    const donationCounterEl = document.getElementById("donation-counter");
    const amountEl = document.getElementById("amount-donated");
    let fakeDonation = 0;

    // const myInit = {
    //     method: 'GET',
    //     headers: {
    //         'Access-Control-Allow-Headers': 'X-API-Key',
    //         'Host': 'www.speedrun.com',
    //         'Accept': 'application/json',
    //         'X-API-Key': 'pzhp383omhr9ib37oc3kesqjh',
    //       },
    //     mode: 'cors'
    //   };

    let response = await fetch('https://www.speedrun.com/api/v1/games/k6q4v49d/donations', {cache: 'no-store'});
    let data = await response.json();
    let donationTotal = data.data['total-donated'];
    let adjustedTotal = donationTotal + fakeDonation;
    
    amountEl.textContent = adjustedTotal / 100;
    let progressValue = adjustedTotal / 3000_00;

    donationCounterEl.style.setProperty('--progress-scale', "scaleX(" + progressValue + ")");
}

setTimeout(
    function(){
        fetchDonationData();
        setInterval(fetchDonationData, 60000)
    }, 8000);