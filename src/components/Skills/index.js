import './index.css'

const Skills = props => {
  const {skills} = props
  const {name, imageUrl} = skills

  return (
    <li className="eachSkill">
      <img src={imageUrl} alt={name} className="image-skill" />
      <p className="skillName">{name}</p>
    </li>
  )
}
export default Skills
