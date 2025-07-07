import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css                    */import{c,e as m,q as p,b as u,w as g,o as y}from"./firebase-D7X223rW.js";let i=[];const r=e=>e&&e.seconds?new Date(e.seconds*1e3).toLocaleString():"N/A",w={verified:{text:"Verified",color:"blue-500",pulse:!0},resolved:{text:"Resolved",color:"green-500",pulse:!1},rejected:{text:"Rejected",color:"red-500",pulse:!1},pending_verification:{text:"Pending",color:"yellow-500",pulse:!0}};function x(e){const t=e.length,n=e.filter(o=>o.severityLevel==="High").length,d=e.filter(o=>{const s=new Date,a=new Date(o.createdAt.seconds*1e3);return s.toDateString()===a.toDateString()}).length;document.getElementById("total-reports-value").textContent=t,document.getElementById("high-severity-value").textContent=n,document.getElementById("new-today-value").textContent=d;const l=document.getElementById("reports-table-body");l.innerHTML="",e.forEach(o=>{const s=w[o.status]||{text:"Unknown",color:"gray-500"},a=`
      <tr class="hover:bg-gray-50">
        <td class="py-4 px-6 text-sm font-medium text-gray-900">${o.incidentType}</td>
        <td class="py-4 px-6 text-sm text-gray-500">${o.severityLevel}</td>
        <td class="py-4 px-6 text-sm text-gray-500">${o.description.substring(0,50)}...</td>
        <td class="py-4 px-6 text-sm text-gray-500">${r(o.createdAt)}</td>
        <td class="py-4 px-6 text-sm">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${s.color.split("-")[0]}-100 text-${s.color}">
            ${s.pulse?`<span class="mr-1.5 h-2 w-2 bg-${s.color} rounded-full animate-pulse-custom"></span>`:""}
            ${s.text}
          </span>
        </td>
        <td class="py-4 px-6 text-sm font-medium text-right">
          <button onclick="showReportDetails('${o.id}')" class="text-indigo-600 hover:text-indigo-900">View</button>
        </td>
      </tr>
    `;l.innerHTML+=a}),f(e)}function f(e){window.map&&window.map.markers?(window.map.markers.forEach(t=>t.setMap(null)),window.map.markers=[]):window.map&&(window.map.markers=[]),e.forEach(t=>{if(window.google&&window.map&&t.location){const n=new google.maps.Marker({position:t.location,map:window.map,title:t.incidentType});window.map.markers.push(n)}})}window.showReportDetails=function(e){const t=i.find(n=>n.id===e);t&&(document.getElementById("modal-title").textContent=t.incidentType,document.getElementById("modal-status").textContent=t.status,document.getElementById("modal-severity").textContent=t.severityLevel,document.getElementById("modal-timestamp").textContent=r(t.createdAt),document.getElementById("modal-description").textContent=t.description,document.getElementById("modal-image").src=t.imageUrl,document.getElementById("modal-location").textContent=`Lat: ${t.location.lat}, Lng: ${t.location.lng}`,document.getElementById("report-details-modal").classList.remove("hidden"))};window.hideReportDetails=function(){document.getElementById("report-details-modal").classList.add("hidden")};function h(){const e=c(m,"reports"),t=p(e,g("status","in",["verified","resolved"]),u("createdAt","desc"));y(t,n=>{i=n.docs.map(d=>({id:d.id,...d.data()})),x(i)},n=>{console.error("Error fetching reports: ",n)})}document.addEventListener("DOMContentLoaded",()=>{window.lucide&&lucide.createIcons(),h()});
