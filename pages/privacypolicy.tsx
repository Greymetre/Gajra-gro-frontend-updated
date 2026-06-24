import * as React from "react";
import html2canvas from "html2canvas";

import { Button,Container, Card, Col, Row } from 'react-bootstrap'



export default function  Privacypolicy() {
    const canvasRef = React.useRef<HTMLInputElement>(null);



const saveAs = (uri:any, filename:any) => {
    var link = document.createElement("a");
  
    if (typeof link.download === "string") {
      link.href = uri;
      link.download = filename;
  
      //Firefox requires the link to be in the body
      document.body.appendChild(link);
  
      //simulate click
      link.click();
  
      //remove the link when done
      document.body.removeChild(link);
    } else {
      window.open(uri);
    }
  };
  
    const printDocument = (domElement:any) => {
        html2canvas(domElement).then(canvas => {
          saveAs(canvas.toDataURL(), "file-name.png");
        });
      
        console.log(html2canvas);
      };
      
  
    return (
        <div ref={canvasRef} >
        

        <Container     >
<h1 className="m-25"style={{textAlign: "left"}}>ACCEPTANCE OF TERMS OF SERVICE</h1>
<div className="m-t-25"style={{textAlign: "right"}}> 
{/* <Button className="btn btn-dark" 
onClick={() => printDocument(canvasRef.current)}
>Download </Button> */}
</div>       
        
        <p>
        These terms and conditions form a contract between you and Hero MotoCorp Ltd. (HMCL) in respect of the Service. For your own benefit and protection, please read the terms and conditions set out herein carefully before you register for and use the Service of HMCL.
        </p>
        <p>
        By registering for and/or by using the Service through your Mobile device, You confirm that you have read, understood and accepted these Terms and Conditions and are legally bound by these Terms and Conditions, and all other terms and conditions that govern HMCL online Website, as may be amended from time to time (collectively, the "Terms and Conditions") and they will continue to apply every time you use the Service. If you do not accept any of the Terms & Conditions stated herein do not use the Service.
        </p>
        <p>
        The functionality and Information available through this Service are more limited than the functionality and information available through HMCL Website. TERMS & CONDITIONS


        </p>
        <p>In these terms and conditions, "you" and "your" mean the individual who is using the Service.

        </p>
<ol type="1" className="m-t-20">
  <li  className="m-15 ">GENERAL<br/>
  By installing the Application (Software), provided by HMCL to offer services related to HMCL, HMCL's services and any upgrades from time to time and any other software or documentation which enables the use of the Application, you agree to be bound by these terms of use ("terms"). Please review them carefully before installation and/or acceptance.</li>
 
 
 
 
  <li className="m-15 "> LIMIT TO USERS<br/>
  The Application, containing information on HMCL, its products, services, offers, promotions etc. is intended for use only in India. The Application allows you to access certain functionality available on HMCL website. Such access will be governed by HMCL Website Terms of Use.
  <br/>
  Any personal information you supply to HMCL while using the Application will be used by HMCL in accordance with the Privacy Policy available in HMCL Website.</li>
  
  <li className="m-15 "> CONDITIONS OF USE:  <br/>
  You understand, acknowledge and agree that:

You will only use the Service and the Application, currently made available to you free of charge, solely and exclusively for your own personal, private, non-commercial use and on registered mobile devices that are authorized by HMCL, belonging to you; HMCL reserves the right to amend or withdraw the Application or change for the application or service provided to you in accordance with the terms at any time for any reason.

The terms of agreement with your respective mobile network provider('Mobile Provider') will continue to apply when using the Application and Mobile Provider may charge to access to network connection services for the duration of the connection with accessing the Application or any such third party charges as may arise. You accept responsibility for any such charges that arise

You will at all times comply with (and your use of the Service and the Application will at all times be in compliance with) the Terms and Conditions, all applicable laws, rules and regulations, and you will not allow any other party to use the Service or the Application for or in connection with any illegal purpose or activity.

Use of the Application including the Service is at your own risk and you are solely responsible for the use of any data, information or services obtained through the use of the Service;

The Service is provided as a convenience to you. The information accessible through the Service is more limited than the information available through the HMCL website; and

In the event that you fail to comply with the Terms and Conditions or your account with HMCL is closed, all rights granted to you in relation to the Application and the Service shall immediately come to an end and you will immediately destroy all copies of the Application.</li>

  <li className="m-15 ">RESTRICTIONS ON USE:<br/>You are hereby granted a limited, non-exclusive, non-transferable, non-assignable license to view and use the Application (which shall include future updates made available to you from time to time, provided you understand that such updates may be subject to additional terms in respect of which you will be notified at the time such update is made available) to access from your mobile device,.

You will not:

Alter, modify, adapt or translate the whole or any part of the Application, or any other computer software made accessible to you or otherwise and use the Service, or perform maintenance on the Application,

Copy, reproduce, duplicate, compile, disseminate, reverse engineer, disassemble, decompile, transfer, exchange disable any features, or otherwise derive the source code for the Application, or any component of the Application or the Service whatsoever, in whole or in part;

Merging the Application or any component thereof into any other programs or create derivative works based on any component of the Application;

Use the Application in whole or in part or any confidential information relating thereto to create software that is functionally equivalent to the Application or any part thereof;

License, sublicense, sell, disseminate, broadcast, transmit, or otherwise distribute the Application or the Service in any form or by any means, or otherwise transfer, assign, manipulate, or grant any rights of use or any other rights in respect of the Application or the Service, or any part thereof, or the information contained therein, to any other party;

Remove or tamper with any proprietary notices or labels, including copyright notices or data source attributions, attached to or contained within the Application or the Service;

Use the Application or the Service in any way that may lead to the encouragement, procurement or carrying out of any unlawful or criminal activity or which may cause any harm or injury to any person;

Cause damage to any of the websites, servers, systems or equipment used in the provision of the Service by HMCL or any other third party, and you may not access or attempt to access any user data or to penetrate any of the security measures relating to the Service; and will in all cases indemnify and hold harmless HMCL from any and all Claims in respect thereof.</li>
  
  <li className="m-15 ">ACCESS <br/> 
  You are solely responsible for all information entered through or electronically transmitted to us through the Service using your sign-on password, and/or access code, and you accept that all such data transmissions are undertaken at your own risk. HMCL is not liable for any error made by you in entering any details or providing any orders and you agree that HMCL shall be entitled to rely upon orders received from you using your sign-on password. You must always keep confidential, and will take all necessary precautions to ensure the confidentiality and security of all of your access credentials, and will take all necessary precautions to prevent unauthorized access to the Service.</li>

 
  <li className="m-15 ">AVAILABILITY<br/>
  <ol>
    <li>This Application is available to a compatible mobile telephone or handheld mobile devices viz., Android OS Operating Systems devices running Android 4.1 & above , with internet access. The version of the Application software may be upgraded from time to time to add support for new functions and services. HMCL will use reasonable efforts to make the Application available at all times. However you acknowledge the Application is provided over the internet and mobile networks and so the quality and availability of the Application may be affected by factors outside HMCL reasonable control.</li>
    <li>HMCL, and third party, do not accept any responsibility whatsoever for unavailability of the Application, or any difficulty or inability to download or access content or any other communication system failure which may result in the Application being unavailable.

</li>
    <li> HMCL will not be responsible for any support or maintenance for the Application.</li>
   

  </ol>
  
  </li>
  
  <li className="m-15 "> PROPRIETARY RIGHTS AND LICENCE

<br/> <ol>
  <li> All ownership, rights, title, interest, database rights and other intellectual property rights of any nature in the Application together with the underlying software code, all information, data, text, software, music, video clips, animation, sound, photographs, images, pictures, graphics, messages, tags, or other materials and the Service, including, but not limited to, all trade names and any and all copyright, patents, trademarks, and service marks relating thereto, are and shall remain the property of HMCL and/or its licensors and nothing herein shall be construed as granting any rights therein to you. You acquire no right, title or interest whatsoever in or to the Application or the Service, as either of them exist now or in the future.<br/>
  All intellectual property rights owned by third parties in any Information provided by third parties shall at all times remain the property of such third parties. Your use of such Information is subject to the terms and conditions of each applicable third party. HMCL accepts no liability for any Information provided by third parties and make no representations or warranties that such Information will be accurate or timely.</li>
    <li> HMCL hereby grants you a worldwide, non-exclusive, royalty-free revocable licence to use the Application for your personal use in accordance with these terms.

</li>

    </ol></li>
  <li className="m-15 "> TERMINATION AND MODIFICATION <br/>
  You understand, acknowledge and agree that HMCL may in its sole discretion, at any time:

Modify any part of the Service and/or change the terms and conditions upon which the Service is provided to you,

Discontinue temporarily or permanently, or terminate the Service in part or in its entirety,

Without notice terminate or otherwise limit your access to the Service at any time for any reason, including, without limiting the generality of the foregoing, in the event that HMCL believes that you are in breach of or have failed to comply with any of the Terms and Conditions or in the event that HMCL believes that you are using the Service illegally, fraudulently or improperly, in which event all rights granted to you hereunder shall immediately cease without notice to you.

HMCL shall not be liable to you or to any third party for any modification, suspension or discontinuance of the Service.

Upon any termination, (a) the rights and licenses granted to you herein shall terminate; (b) you must cease all use of the Software; </li>

 
  <li className="m-15 ">LIMITATION OF LIABILITY<br/>
  <ol>
    <li>You acknowledge that the Service and the Application utilize complex computer and telecommunications networks and that, as such, continued, uninterrupted and error free access to the Service and/or the Application cannot be guaranteed. In the light of the foregoing, HMCL or any third party, officers, directors, employees, representatives, successors and assigns shall not be liable in any way for any loss or damage, direct or indirect, which may arise, from any outage, interruption, discontinuation or delay in the Service or the Application or any part thereof or any error contained therein, or from any other non-performance, defective performance or late performance due to any cause whatsoever, including errors due to malfunction of equipment, programs or operations of HMCL or any third parties, or negligence of HMCL or any third party.</li>
    <li> In no event will HMCL be liable for any direct, indirect, special, punitive, exemplary or consequential losses or damages of whatsoever kind arising out of your use or inability to use or access or inability to access to the Service or Application, including loss of profit or the like whether or not in the contemplation of the parties, whether based on breach of contract, tort (including negligence) or otherwise.</li>
    <li>HMCL is not liable to you for any damage or alteration to your equipment including but not limited to computer equipment, handheld device or mobile telephones as a result of the installation or use of the Application.

</li>
   
    </ol></li>
  
  <li className="m-15 "> DISCLAIMER OF WARRANTIES <br/> 
  <ol>
    <li> The Service may be delayed, unavailable, not delivered and/or inaccurate from time to time due to a variety of factors, including technical reasons, for planned or unplanned maintenance or downtime, for editorial amendments or for any other reason. The Service may be adversely affected by the performance of and any outages on mobile device networks, or when you are not in an area of mobile coverage, or other factors beyond the control of HMCL or any third party, and neither HMCL nor any third party will be liable therefor.

</li>
    <li> The Service and the Application are provided �as is� and �as available�, and all warranties, representations and guarantees, express or implied, are hereby disclaimed. Without limiting the generality of the foregoing, any and all warranties of merchantability, fitness for a particular purpose, suitability, reliability, accuracy, performance, compatibility or non-infringement, or that the Service or the Application will be free from defects, errors, viruses, worms or harmful programs, or be of a satisfactory quality, are hereby expressly disclaimed or that access to the Application will be uninterrupted or error-free.</li>
    <li> Neither HMCL nor any third party provider makes any warranty, representation or guarantee as to the accessibility, reliability, communication links, accuracy, truth, timeliness, or completeness of any Information or data furnished through the Service.

</li>
   
    </ol></li>
  <li className="m-15 ">INDEMNIFICATION<br/>
  You agree to defend, indemnify and hold HMCL, its Affiliates, officers, directors, employees, representatives, successors and assigns, harmless from any and all claims, liabilities, costs and expenses, including reasonable attorneys' fees, arising in any way from your use or misuse of the Application or Services or any violation of these Terms and Conditions by you.
  </li>
  
  <li className="m-15 "> INDEPENDENT CONTRACTORS <br/> You acknowledge that the usage of this Website by you does not constitute a joint venture, partnership, employment or agency relationship between you and HMCL. You agree not to hold yourself as a representative, agent or employee of HMCL and HMCL shall not be liable for any representation, act or omission by you.</li>
  
  <li className="m-15 ">LAWS AND JURISDICTION<br/>The interpretation of these terms and conditions shall be construed in accordance with and governed by the laws of India. Any disputes arising under or in connection with the use of Application or Service or the Terms shall be subject to the exclusive jurisdiction of the Courts in New Delhi, India.</li>
  
  <li className="m-15 ">MISCELLANEOUS <br/>If any part of these Terms and Conditions is held invalid or unenforceable under any applicable law, the validity or enforceability of the remaining provisions contained herein shall not be affected in any manner whatsoever, and any such invalid or unenforceable provision shall be deemed to be severable and ineffective only to the extent necessary to render the remaining portions of these terms and conditions valid and enforceable. The section titles in these Terms and Conditions are for convenience only, and have no legal or contractual effect. You shall not transfer, assign, sublicense nor pledge in any manner whatsoever, any of your rights or obligations under these Terms and Conditions. HMCL may transfer, assign sublicense or pledge in any manner whatsoever, any of its rights and obligations under these Terms and Conditions to a subsidiary, affiliate or to any third party whatsoever, without notifying you or receiving your consent. </li>
  
</ol>
</Container>


<footer className="footer">
    
</footer>

        
      </div>
    );
  }