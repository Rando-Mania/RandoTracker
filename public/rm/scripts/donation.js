const fetchDonationData = async () => {
    // const donationCounterEl = document.getElementById("donation-counter");
    // const amountEl = document.getElementById("amount-donated");
    // let fakeDonation = 0;

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

    try{
        const apiInit = {
            method: 'GET',
            headers: {
                'Host': 'donations.randomania.net',
                'Accept': 'application/json',
            },
        };

        // const apiUrl = 'https://donations.randomania.net/tracker/event/1?json';
        const apiUrl = 'https://donations.randomania.net/tracker/search/?type=event'
        const response = await fetch(apiUrl, apiInit);
        console.log(response.ok);
        console.log(response.status);
        console.log(response.body);
        const data = await response.json();
        return data;
    } catch(err) {
        console.error(err)
    }
}
    
fetchDonationData().then(data => console.log(data));

    // let donationTotal = data.data['total-donated'];
    
    // let donationTotal = data.agg['amount'];

    // let adjustedTotal = donationTotal + fakeDonation;
    
    // amountEl.textContent = adjustedTotal / 100;
    // let progressValue = adjustedTotal / 3000_00;

    // donationCounterEl.style.setProperty('--progress-scale', "scaleX(" + progressValue + ")");

// setTimeout(
//     function(){
//         fetchDonationData();
//         setInterval(fetchDonationData, 60000)
//     }, 8000);