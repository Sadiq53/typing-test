import { useEffect } from "react";
import Footer from "../../../../shared/footer/Footer"
import Header from "../../../../shared/header/Header"
import { useState } from "react";
import {useSelector} from 'react-redux'


const Terms_Condition = () => {

  const termData = useSelector(state => state.DynamicPagesDataSlice?.term)
  const [formattedDate, setFormattedDate] = useState();

  useEffect(() => {
    if (termData?.createdat) {
      // Try converting the date string to a JavaScript Date object
      const rawDate = termData.createdat;
      
      // Check if the rawDate is valid and then parse it
        const parsedDate = new Date(rawDate);
        
        if (!isNaN(parsedDate)) {
          // Format the valid date to '04 Oct 2024' format
          setFormattedDate(
            new Intl.DateTimeFormat('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }).format(parsedDate)
          );
        } else {
          console.error('Invalid date format:', rawDate);
        }
      }
      console.log('Invalid date format:', termData); 
    }, [termData]);

  return (
    <>
        <Header />
        <section>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                      <div className="header-dynamic-page">
                        <h4 className="font-active">Terms & Condition</h4>
                        <p className="font-idle">{formattedDate}</p>
                      </div>
                    <div className="dynamic-paglayout my-4" dangerouslySetInnerHTML={{ __html: termData?.content }}></div>
                    </div>
                </div>
            </div>
        </section>
        <Footer />
    </>
  )
}

export default Terms_Condition