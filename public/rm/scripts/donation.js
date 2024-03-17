const fetchDonationData = async () => {
    const donationCounterEl = document.getElementById("donation_counter");

    const apiInit = {
        method: 'GET',
        headers: {
            'Host': 'donations.randomania.net',
            'Accept': 'application/json',
        },
    };
    // const apiUrl = 'https://donations.randomania.net/tracker/event/1?json';
    const apiUrl = 'https://donations.randomania.net/tracker/event/2?json';
    const response = await fetch(apiUrl, apiInit);
    const data = await response.json();
    
    let donationTotal = data.agg.amount;
    let donationTarget = data.agg.target;

    donationCounterEl.textContent = '$' + donationTotal;
    let progressValue = donationTotal / donationTarget;

    donationCounterEl.style.setProperty('--progress-scale', "scaleX(" + progressValue + ")");
}

setTimeout(
    function(){
        fetchDonationData();
        setInterval(fetchDonationData, 60000);
    }, 8000);