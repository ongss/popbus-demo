window.onload = function(){
	getStationFormApi(user,key);
	setTimeout(function(){
		getPopBusDataFromApi(user,key);
	},100);
	setInterval(function(){
		updatePopBusDataFromApi();
		for(let i=0;i<station.length;i++){
			station[i].updateHtmlElement();
		}
	},1000);
	var selector = new StationSelector(station);
}

// FUNCTION

const stationName1 = 	["Salaprakeaw",
						 "Faculty of Political Science",
						 "Patumwan Demonstration School",
						 "Faculty of Veterinary Science",
						 "Chaloemphao Junction",
						 "Lido",
						 "MBK Center",
						 "Triamudom Suksa School",
						 "Faculty of Architecture",
						 "Faculty of Arts",
						 "Faculty of Engineering"];
const stationName2 = 	["Salaprakeaw",
						 "Mahitaladhibesra Building",
 						 "Mahamakut Building",
						 "Faculty of Science",
						 "Faculty of Education",
						 "Sport Complex",
						 "Charmchuri 9 Building",
						 "CU Dharma Centre",
						 "CU Dormitory",
						 "x chamchuri 10",
						 "x allied health science",
						 "x bts",
						 "Faculty of Sports Science",
						 "x allied health science",
						 "x chamchuri 10",
						 "CU Dormitory",
						 "CU Office",
						 "Faculty of Architecture",
						 "Faculty of Arts",
						 "Faculty of Engineering"];
const stationName3 = 	["Salaprakeaw",
						 "Mahitaladhibesra Building",
						 "Faculty of Political Science",
						 "Faculty of Medicine",
						 "Faculty of Political Science",
						 "Mahamakut Building",
 						 "Faculty of Science",
						 "Faculty of Architecture",
  						 "Faculty of Arts",
						 "Faculty of Engineering"];
const stationName4 = 	["Salaprakeaw",
						 "Mahitaladhibesra Building",
						 "Patumwan Demonstration School",
						 "Faculty of Veterinary Science",
						 "Chaloemphao Junction",
						 "Lido",
						 "MBK Center",
						 "Triamudom Suksa School",
						 "Faculty of Education",
						 "Sport Complex",
						 "Charmchuri 9 Building",
						 "U-Center",
						 "Faculty of Law",
						 "Faculty of Architecture",
						 "Faculty of Arts",
						 "Faculty of Engineering"];
const stationName5 = 	["Salaprakeaw",
						 "Faculty of Political Science",
						 "Mahamakut Building",
						 "Faculty of Science",
						 "x communication arts",
						 "x samyan market",
						 "x i'm park",
						 "CU Terrace",
						 "CU Office",
						 "Faculty of Architecture",
						 "Faculty of Arts",
						 "Faculty of Engineering"];

const url = "http://45.76.188.63:3000"; 
const user = "wsvnlq0s";
const key = "iBPqfYnJLjDsjZfK1oPagJ1GCmM8gcyb";

var curId = 0;
var station = [];
var popbus = [];

var selector;
var loadDataFromApi = false;

function initSelector(){
	var selector = new StationSelector(station);
	selector.init();
	selector.createHtmlElement(document.body);
	return selector;	
}

function setProgress(id,value) {
	let pro = document.getElementById(id);
	let pos = Math.floor(pro.clientWidth);
	let val = Math.floor(value);
	let animate = setInterval(function(){
		if(pos > value) pos--;
		else if(pos < value) pos++;
		pro.style.width = pos + '%';
		if(pos === value || pos === 0) clearInterval(animate);
	},10)
}

function hideAllStation(){
	for(let i=0;i<station.length;i++){
		let tmp = document.getElementById(station[i].name);
		tmp.style.display = "none";
	}
}

function addNewStation(name,lat,long,line){
	let tmp = new Station(name,lat,long,line);
	station.push(tmp);
	tmp.createHtmlElement(document.body);
	return tmp;
}

function getCurStation(){
	if(!loadDataFromApi) return null;
	let e = document.getElementById("select");
	return selector.station[e.selectedIndex];
}

function addNewPopBus(BusId,line,lat,long,status,weight,maxWeight,station){
	let tmp = new PopBus(BusId,line,lat,long,status,weight,maxWeight,station);
	popbus.push(tmp);
	return tmp;
}


function getStationFormApi(user,key){
	$.ajax({
	 	url: url+"/get/stations",
	 	type: "POST",
	 	data:{
	 		busnumber: null,
	 		busid: "1"
	 	},
	 	beforeSend: (xhr) => {
	 		xhr.setRequestHeader('Client-ID',user);
	 		xhr.setRequestHeader('Client-Secret',key);
	 	},
	 	success: (data,textStatus,req) => {
	 		for(let i = 0;i<data.data.length;i++){
				var tmp = addNewStation(data.data[i].name,data.data[i].latitude,data.data[i].longitude,data.data[i].line);
			}
			selector = initSelector();
	 	},
	 	error: () => {
	 		console.log("error");
	 	}
	})
	
}

function updatePopBusDataFromApi(){
	$.ajax({
	 	url: url+"/get/position",
	 	type: "POST",
	 	data:{
	 		busnumber: null,
	 		busid: "1"
	 	},
	 	beforeSend: (xhr) => {
	 		xhr.setRequestHeader('Client-ID',user);
	 		xhr.setRequestHeader('Client-Secret',key);
	 	},
	 	success: (data,textStatus,req) => {
	 		for(let i=0;i<data.data.length;i++){
	 			popbus[data.data[i].id-1].line = data.data[i].line;
	 			popbus[data.data[i].id-1].lat = data.data[i].latitude;
	 			popbus[data.data[i].id-1].long = data.data[i].longitude;
	 		}
	 	},
	 	error: () => {
	 		console.log("error");
	 	}
	}).then(function(){
		$.ajax({
	 		url: url+"/get/weight",
	 		type: "POST",
	 		data:{
	 			busnumber: null,
	 			busid: "1"
	 		},
	 		beforeSend: (xhr) => {
	 			xhr.setRequestHeader('Client-ID',user);
	 			xhr.setRequestHeader('Client-Secret',key);
	 		},
	 		success: (data,textStatus,req) => {
	 			for(let i=0;i<data.data.length;i++){
	 				popbus[data.data[i].id-1].personCnt = Math.floor((data.data[i].currentWeight - data.data[i].minWeight)/60);
	 				popbus[data.data[i].id-1].maxPersonCnt = Math.floor((data.data[i].maxWeight - data.data[i].minWeight)/60);	
	 			}
	 		},
	 		error: () => {
	 			console.log("error");
	 		}	
		})
	})
}

function getPopBusDataFromApi(user,key){
	$.ajax({
	 	url: url+"/get/position",
	 	type: "POST",
	 	data:{
	 		busnumber: null,
	 		busid: "1"
	 	},
	 	beforeSend: (xhr) => {
	 		xhr.setRequestHeader('Client-ID',user);
	 		xhr.setRequestHeader('Client-Secret',key);
	 	},
	 	success: (data,textStatus,req) => {
	 		for(let i=0;i<data.data.length;i++){
	 			addNewPopBus(data.data[i].id,data.data[i].line,data.data[i].latitude,data.data[i].longitude,true,null,null,null);
	 		}
	 	},
	 	error: () => {
	 		console.log("error");
	 	}
	}).then(function(){
		$.ajax({
	 		url: url+"/get/weight",
	 		type: "POST",
	 		data:{
	 			busnumber: null,
	 			busid: "1"
	 		},
	 		beforeSend: (xhr) => {
	 			xhr.setRequestHeader('Client-ID',user);
	 			xhr.setRequestHeader('Client-Secret',key);
	 		},
	 		success: (data,textStatus,req) => {
	 			for(let i=0;i<data.data.length;i++){
	 				console.log(popbus[data.data[i].id-1]);
	 				popbus[data.data[i].id-1].personCnt = Math.floor((data.data[i].currentWeight - data.data[i].minWeight)/60);
	 				popbus[data.data[i].id-1].maxPersonCnt = Math.floor((data.data[i].maxWeight - data.data[i].minWeight)/60);	
	 			}
	 		},
	 		error: () => {
	 			console.log("error");
	 		}	
		})
	}).then(function(){
		loadDataFromApi = true;
		for(let i=0;i<popbus.length;i++){
			for(let j=0;j<station.length;j++){
				if(station[j].line.indexOf(popbus[i].line) > -1){
					station[j].addPopBus(popbus[i]);
				}
			}
		}
	})
}

function measure(lat1, lon1, lat2, lon2){  // generally used geo measurement function
	var R = 6378.137; // Radius of earth in KM
	var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
	var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
	Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
	Math.sin(dLon/2) * Math.sin(dLon/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = R * c;
	return d * 1000; // meters
}

// CLASS


class PopBus {
	constructor(BusId,line,lat,long,status,weight,maxWeight,station) {
		this.BusId = BusId
		this.line = line
		this.lat = lat
		this.long = long
		this.status
		this.station = station
		this.personCnt = Math.floor(weight/60)
		this.maxPersonCnt = Math.floor(maxWeight/60)
	}
	findPos(name) {
		let stationName = this.getStationLine();
		for(let i=0;i<stationName.length;i++){
			if(stationName[i] === name) return i;	
		}
		return -1;
	}
	getStationLine(){
		let stationName;
		if(this.line === 1) stationName = stationName1;
		if(this.line === 2) stationName = stationName2;
		if(this.line === 3) stationName = stationName3;
		if(this.line === 4) stationName = stationName4;
		if(this.line === 5) stationName = stationName5;
		return stationName;
	}
	cntNextStation(name) {
		let cnt = 0;
		let start = this.findPos(this.station.name);
		let stationName = this.getStationLine();
		if(start === -1) return -1;
		while(cnt < stationName.length){
			if(stationName[(start+cnt)%stationName.length] === name) return cnt;
			cnt++;
		}
	}
	updateData(line,lat,long,status,weight,station){
		this.line = line;
		this.lat = lat;
		this.long = long;
		this.status = status;
		this.weight = weight;
		this.station = station;
		this.personCnt = Math.floor(weight/60);
	}
	measureWithStation(station){
		this.station = station;
		return measure(this.lat,this.long,station.lat,station.long);
	}
}

class PopBusInStation {
	constructor(id,popbus){
		this.id = id;
		this.popbus = popbus;
		this.wasCreate = false;

	}
	
	updateProgressBar(){
		setProgress(this.id+"bar",Math.floor(this.popbus.personCnt/this.popbus.maxPersonCnt*100));
	}

	updateHtmlElement(){
		var div = document.getElementById(this.id);
		var title = document.getElementById(this.id+"title");
		var img = document.getElementById(this.id+"img");
		var info = document.getElementById(this.id+"info");
		title.innerHTML = "สาย "+this.popbus.line;
		img.src = "./resource/logo.png";
		info.innerHTML = this.popbus.personCnt+"/"+this.popbus.maxPersonCnt+" คน";
		this.updateProgressBar();
	}

	createHtmlElement(root){
		this.wasCreate = true;
		var div = document.createElement("div");
		div.className = "popBusBroder";
		div.id = this.id;
		var title = document.createElement("h4");
		title.className = "popBusTitle";
		title.innerHTML = "สาย "+this.popbus.line;
		title.id = this.id+"title";
		div.appendChild(title); 
		var img = document.createElement("img");
		img.src = "./resource/logo.png";
		img.className = "popBusImage";
		img.id = this.id+"img";
		div.appendChild(img);
		var pro = document.createElement("div");
		pro.className = "progress";
		var bar = document.createElement("div");
		bar.className = "bar";
		bar.id  = this.id+"bar";	
		pro.appendChild(bar);
		div.appendChild(pro);
		var info = document.createElement("p");
		info.className = "popBusInfo";
		info.innerHTML = this.popbus.personCnt+"/"+this.popbus.maxPersonCnt+"คน";
		info.id = this.id+"info";
		div.appendChild(info);
		root.appendChild(div);
	}

	createHtmlElementNonAnimate(root){
		this.createHtmlElement(root);
		let pro = document.getElementById(this.id+"bar");
		let val = Math.floor(this.popbus.personCnt/this.popbus.maxPersonCnt*100);
		pro.style.width = val + '%';
	}
}


class Station{

	constructor(name,lat,long,line){
		this.name = name;
		this.popBusQueue = [];
		this.lat = lat;
		this.long = long;
		this.line = line;
	}

	addPopBus(popBus){
		var tmp = new PopBusInStation(curId++,popBus);
		this.popBusQueue.push(tmp);
		this.updateHtmlElement();
		tmp.updateProgressBar();
	}

	compare(popBusA,popBusB){
		let station = getCurStation()
		if(station===null) return true
		let lenA = popBusA.popbus.measureWithStation(station);
		let lenB = popBusB.popbus.measureWithStation(station);
		if(lenA===lenB) {
			/*
			for(let i=0;i<6;i++){
				if(popBusA.popbus.line[i]!==popBusB.popbus.line[i]){
					return popBusA.popbus.line[i] < popBusB.popbus.line[i] ? 1 : -1
				}
			}*/
			if(popBusA.popbus.personCnt===popBusB.popbus.personCnt){
				return 0;
			}
			return popBusA.popbus.personCnt < popBusB.popbus.personCnt ? 1 : -1;
		}
		return lenA < lenB ? -1 : 1;
	}

	updateHtmlElement(){
		var div = document.getElementById(this.name);
		div.innerHTML = "";
		var title = document.createElement("h2");
		title.className = "stationTitle";
		title.innerHTML = "สถานี : "+this.name;
		div.appendChild(title);
		this.popBusQueue.sort(this.compare);
		for(let i=0;i<this.popBusQueue.length;i++){
			if(this.popBusQueue[i].wasCreate){
				this.popBusQueue[i].createHtmlElementNonAnimate(div);
			}
			else{
				this.popBusQueue[i].createHtmlElement(div);
				this.popBusQueue[i].updateHtmlElement();
				console.log("helo");	
			}
		}
	}

	createHtmlElement(root){
		var div = document.createElement("div");
		div.className = "stationBroder";
		div.id = this.name;
		root.appendChild(div);
		this.updateHtmlElement();
		//TODO GENERATE HTML ELEMENT AND ADDED IN PRARENT
	}
}

class StationSelector{
	constructor(stationlist){
		this.station = stationlist;
	}

	init(){
		for(let i=1;i<station.length;i++){
		let tmp = document.getElementById(station[i].name);
		tmp.style.display = "none";
		}
	}

	createHtmlElement(root){
		var div = document.createElement("div");
		div.className = "select-style";
		var sel = document.createElement("select");
		sel.className = "select";
		sel.id = "select";
		sel.addEventListener("change",function(){
			let e = document.getElementById("select");
			let selected = e.options[e.selectedIndex].value;
			hideAllStation();
			
			let tar = document.getElementById(selected);
			tar.style.display = "block";
		},false);

		var tmp = document.createElement("option");
		tmp.value = "";
		tmp.text = "Where are you now?";
		tmp.selected = true;
		tmp.disabled = true;
		tmp.hidden = true;
		sel.appendChild(tmp);

		for(let i=0;i<this.station.length;i++){
			tmp = document.createElement("option");
			tmp.value = this.station[i].name;
			tmp.text = this.station[i].name;
			sel.appendChild(tmp);
		}

		div.appendChild(sel);
		root.insertBefore(div,root.childNodes[2]);
	}
}