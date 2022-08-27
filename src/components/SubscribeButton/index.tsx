import {signIn, signOut, useSession} from 'next-auth/react';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss'

interface SubscribeButtonProps{
    priceId: string
}
//lugares para colocar key sem ser no client(ou seja mais seguranca)
//getServiceSideProps (ssr)
//getStaticProps (ssg)
//Api Routes
export function SubscribeButton({priceId} : SubscribeButtonProps) {
    const { data: session } = useSession();
    async function handleSubscribe(){
      if(!session){
        signIn('github');
        return;
      }
      try{
        const response = await api.post('/subscribe');
        const { sessionId } = response.data;

        const stripe = await getStripeJs();

        await stripe.redirectToCheckout({sessionId})
      }catch(err){
        alert(err.message)
      }
    }
    return(
        <button
        type="button"
        className={styles.subscribeButton}
        onClick={handleSubscribe}
        >
            Subscribe Now
        </button>
    )
}