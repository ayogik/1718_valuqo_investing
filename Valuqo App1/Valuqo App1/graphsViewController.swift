//
//  graphsViewController.swift
//  Valuqo App1
//
//  Created by A K on 6/7/18.
//  Copyright © 2018 Valuqo. All rights reserved.
//

import UIKit
//import Charts

class graphsViewController: UIViewController {

    @IBOutlet weak var lineGraph: UIView!
    @IBOutlet weak var pieChart: UIView!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        
        // request data points from HTTPS server
        
        // setBarChart(dataPoints, values)
        // setPieChart(dataPoints, values)
        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */
    
    
    /*
     func setBarChart(_ dataPoints: [String],_ values: [Double]) { //Create Bar Graph
         var dataEntries: [BarChartDataEntry] = []
     
         for i in 0..<dataPoints.count {
         let dataEntry = BarChartDataEntry(value: values[i], xIndex: i)
         dataEntries.append(dataEntry)
         }
     
         let chartDataSet = BarChartDataSet(yVals: dataEntries, label: "Units Sold")
         let chartData = BarChartData(xVals: months, dataSet: chartDataSet)
         barChartView.data = chartData
     
     }
     
    func setPieChart(_ dataPoints: [String],_ values: [Double]) { //Create Pie Chart
        
        var dataEntries: [ChartDataEntry] = []
        
        for i in 0..<dataPoints.count {
            let dataEntry = ChartDataEntry(value: values[i], xIndex: i)
            dataEntries.append(dataEntry)
        }
        
        let pieChartDataSet = PieChartDataSet(yVals: dataEntries, label: "Units Sold")
        let pieChartData = PieChartData(xVals: dataPoints, dataSet: pieChartDataSet)
        pieChartView.data = pieChartData
        
        var colors: [UIColor] = []
        
        for i in 0..<dataPoints.count {
            let red = Double(arc4random_uniform(256))
            let green = Double(arc4random_uniform(256))
            let blue = Double(arc4random_uniform(256))
            
            let color = UIColor(red: CGFloat(red/255), green: CGFloat(green/255), blue: CGFloat(blue/255), alpha: 1)
            colors.append(color)
        }
        
        pieChartDataSet.colors = colors
        
        
        let lineChartDataSet = LineChartDataSet(yVals: dataEntries, label: "Units Sold")
        let lineChartData = LineChartData(xVals: dataPoints, dataSet: lineChartDataSet)
        lineChartView.data = lineChartData
        
    }*/

}
