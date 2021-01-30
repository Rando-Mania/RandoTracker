async function fetchDonationData(){
    const amountEl = document.getElementById("amount-donated");
    const progressEl = document.getElementById("progress-bar");
    let fakeDonation = 0;

    let response = await fetch('https://www.speedrun.com/api/v1/games/k6q4v49d/donations');
    let data = await response.json();
    let donationTotal = data.data['total-donated'];
    let adjustedTotal = donationTotal + fakeDonation;
    
    amountEl.textContent = adjustedTotal / 100;
    let progressValue = adjustedTotal / 100000;
    progressEl.style.transform = `scaleX(${progressValue})`;
}

setTimeout(
    function(){
        fetchDonationData();
        setInterval(fetchDonationData, 60000)
    }, 8000);