import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faStar, 
  faHeart, 
  faShoppingCart, 
  faGem, 
  faTruck, 
  faGift, 
  faCheckCircle,
  faExclamationTriangle,
  faLeaf,
  faCheck,
  faComments
} from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartEmpty } from '@fortawesome/free-regular-svg-icons'

export function Icon({ name, size = 'lg', className = '' }) {
  const icons = {
    star: faStar,
    heartFilled: faHeart,
    heartEmpty: faHeartEmpty,
    cart: faShoppingCart,
    gem: faGem,
    truck: faTruck,
    gift: faGift,
    checkCircle: faCheckCircle,
    check: faCheck,
    warning: faExclamationTriangle,
    leaf: faLeaf,
    flower: faLeaf,
    rose: faLeaf,
    comments: faComments
  }

  return (
    <FontAwesomeIcon 
      icon={icons[name] || faStar} 
      size={size}
      className={className}
    />
  )
}

export default Icon
