window.onload = async function() {
    var cumulativeData = await getCumulativeSessionData();
    console.log(cumulativeData);

    document.getElementById('cumulativeFocus').innerText = cumulativeData['focusTimers'];
    document.getElementById('cumulativeBreaks').innerText = cumulativeData['breakTimers'];
    document.getElementById('cumulativeLongBreaks').innerText = cumulativeData['longBreakTimers'];
}

async function getCumulativeSessionData() {
    return window.electronAPI.getCumulativeSessionData();
}