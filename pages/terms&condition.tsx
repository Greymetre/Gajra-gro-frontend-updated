import * as React from "react";
import html2canvas from "html2canvas";

import { Button,Container, Card, Col, Row } from 'react-bootstrap'



export default function  TermCondition() {
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
<h1 className="m-25"style={{textAlign: "left"}}>Terms & Conditions</h1>
<div className="m-t-25"style={{textAlign: "right"}}> <Button className="btn btn-dark" 
onClick={() => printDocument(canvasRef.current)}
>Download </Button></div>       
        
<ol type="1" className="m-t-20">
  <li  className="m-15 ">  “Gajra Gro+” Program (“Program”) is a value-added scheme offered and promoted by Gajra Group Company. The Program entitles its registered members the right to earn loyalty points on all their purchases, which can be redeemed by way of encashment as per the redemption policy notified by Gajra Group Company from time to time for the Program. The redemption policy and other conditions notified in due course (of the Program) will always be read along with the Terms and Conditions of the Program.</li>
  <li className="m-15 ">  This Program is open only to mechanics that are resident Indian nationals and complete registration process as prescribed by Gajra Group Company in the Registration Form</li>
  <li className="m-15 ">  Gajra Group Company reserves the right to reject any application for enrolment at its sole discretion, without assigning any reason or warning. Even after registration, Gajra Group Company is well within its right to discontinue/ cancel the registration of a registered member i.e. a mechanics without assigning any reasons or cause as well as any concern such as incomplete information, incorrect information, absence of ID related papers, etc.</li>
  <li className="m-15 ">  Accumulation of points will be subject to the method stipulated by Gajra Group Company in its sole discretion from time to time.</li>
  <li className="m-15 ">  Gajra Group Company will not be responsible for any damaged / mutilated / lost-in-transit / incorrectly-filled forms.</li>
  <li  className="m-15 ">  The explanation and clarification given in the FAQs form part of the Program terms and conditions.</li>
  <li className="m-15 ">  Gajra Group Company reserves the right to withdraw any or all promotion benefits, at any point of time without prior intimation.</li>
  <li className="m-15 ">  Gajra Group Company shall not be responsible for any liability incurred by the mechanics, with respect to any aspect of the Program such as payment of taxes, etc.</li>
  <li  className="m-15 ">  Gajra Group Company shall neither be responsible for any fake or fictitious entry/ registration submitted by the mechanics under this Program, nor shall Gajra Group Company be liable to check the authenticity or credentials of the mechanics. Any issue relating to impersonation or inappropriate usage will not be investigated by Gajra Group Company, however Gajra Group Company would have the right to suspend or terminate any registration in case of receipt of any compliant in this regard.</li>
  <li className="m-15 ">  Gajra Group Company shall not, in any way, be liable or under any obligation to the mechanics if the Program is withdrawn or modified due to statutory enactments, judicial / quasi-judicial orders or any other reasons beyond its control.</li>
  <li className="m-15 ">  Gajra Group Company reserves the right to add, modify, withdraw or delete any of the terms & conditions or the duration of the Program, with or without prior notice.</li>
  <li className="m-15 ">  The points accrued in the mechanics account are non-transferable.</li>
  <li className="m-15 ">  Any fraud or abuse of the rewards / benefits arising out of the Program is subject to appropriate administrative and / or legal action by Gajra Group Company, including forfeiture of accumulated points and related rewards / benefits, and may result into the suspension or cancellation of the membership</li>
  <li className="m-15 ">  The mechanics will be registered under the Program only after all the required documents are received by Gajra Group Company for completion of registration including submission of valid ID proof, registered mobile number and designated bank details.</li>
  <li className="m-15 ">  If some Loyalty points and / or rewards / benefits are wrongly credited into any mechanics account, the same can be debited or reversed by Gajra Group Company by itself and the concerned mechanics shall be informed accordingly.</li>
  <li className="m-15 ">  In case of any dispute on the points and / or rewards / benefits, the same shall be looked into/ resolved only on production of the supporting transaction bill / MRP tag to Gajra Group Company's Call Centre.</li>
  <li className="m-15 ">  If a mechanic believes  he or  she has not received Loyalty points for any transaction, he or she can take up the request with Gajra Group Company, for such credit(s) at their helpline nos.</li>
  <li className="m-15 ">  Gajra Group Company will not accept responsibility for circumstances that are beyond its reach or control, and that may cause a delay or inability to fulfil requests of the registered mechanics</li>
  <li className="m-15 ">  Point conversion percentage can change anytime without prior intimation.</li>
  <li className="m-15 ">  Any dispute, claim or legal action against Gajra Group Company, its agencies and their respective employees related because of this activity/Program will be subject to Dewas, Madhya Pradesh jurisdiction exclusively.
</li>
  

</ol>
</Container>


<footer className="footer">
    
</footer>

        
      </div>
    );
  }