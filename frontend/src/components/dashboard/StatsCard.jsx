// import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"

// const StatsCard = ({ title, value, description, icon: Icon, trend }) => {
//   return (
//     <Card ClassName= "fixed">
//       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//         <CardTitle className="text-sm font-medium">{title}</CardTitle>
//         {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
//       </CardHeader>
//       <CardContent>
//         <div className="text-2xl font-bold">{value}</div>
//         {description && <p className="text-xs text-muted-foreground">{description}</p>}
//         {trend && <div className={`text-xs ${trend.positive ? "text-green-600" : "text-red-600"}`}>{trend.value}</div>}
//       </CardContent>
//     </Card>
//   )
// }

// export default StatsCard
// StatsCard.jsx
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"

const StatsCard = ({ title, value, description, icon: Icon, trend }) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {trend && <div className={`text-xs ${trend.positive ? "text-green-600" : "text-red-600"}`}>{trend.value}</div>}
      </CardContent>
    </Card>
  )
}

export default StatsCard
