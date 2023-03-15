import { useParams } from 'react-router-dom';
const Article = ({match}) => {
    const { title } = useParams();
  return (
    <div className="w-full h-full">Article {title}</div>
  )
}
export default Article