# Guyana Salary & Gratuity Calculator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Last Updated](https://img.shields.io/badge/Last%20Updated-2025%20Fiscal%20Year-brightgreen.svg)](https://github.com/kareemschultz/guyana-salary-calculator)
[![GitHub Stars](https://img.shields.io/github/stars/kareemschultz/guyana-salary-calculator?style=social)](https://github.com/kareemschultz/guyana-salary-calculator/stargazers)

A comprehensive, modern web-based calculator designed specifically for Guyanese employees to calculate their salary, gratuity, and annual package based on the latest 2025 tax regulations. Built with ❤️ by **Kareem Schultz** for the Guyanese workforce.

## 🌟 Live Demo

**[Try the Calculator](https://kareemschultz.github.io/guyana-salary-calculator/)**

## ✨ Key Features

### 💰 **Comprehensive Tax Calculations**
- **2025 Tax Rates**: Updated lower tax brackets (25% up to $260,000, 35% above)
- **Payment Frequency Support**: Daily, Weekly, Fortnightly, Monthly, and Yearly calculations
- **Personal Allowance**: $130,000 monthly or 1/3 of gross income (whichever is greater)
- **NIS Contributions**: 5.6% up to $280,000 monthly ceiling
- **Child Allowances**: $10,000 per child per month

### 🎓 **2025 Qualification Allowances** *(New!)*
- **ACCA Qualification**: $15,000 monthly (non-taxable)
- **Master's Degree**: $22,000 monthly (non-taxable)
- **Doctoral Degree**: $32,000 monthly (non-taxable)
- *Effective January 2025 as announced by President Dr. Irfaan Ali*

### 📊 **Advanced Calculations**
- **Gratuity Management**: 22.5% basic salary accrual with configurable payment periods
- **Special Payment Months**: Month 6 (Net + Gratuity) and Month 12 (Net + Gratuity + Vacation)
- **Annual Package**: Complete yearly breakdown including all components
- **Salary Increase Simulator**: Model potential raises with retroactive pay calculations

### 🏢 **Smart Features**
- **Position Presets**: Pre-configured ICT job positions with standard allowances
- **Allowance Management**: Comprehensive taxable and non-taxable allowance categories
- **Insurance Integration**: Assuria and custom insurance premium calculations
- **Loan Deductions**: Support for personal loans and credit union deductions

### 🎨 **Modern User Experience**
- **Dark Mode by Default**: Optimized for comfortable viewing with light mode toggle
- **Responsive Design**: Perfect experience on desktop, tablet, and mobile devices
- **Interactive Charts**: Visual breakdown of income, taxes, and cash flow
- **Real-time Updates**: Instant calculations as you type
- **Comprehensive Tooltips**: Built-in help for every field and calculation

## 📱 Screenshots

### Dark Mode (Default)
![Dark Mode Calculator](https://via.placeholder.com/800x600/0f172a/f1f5f9?text=Dark+Mode+Calculator)

### Light Mode
![Light Mode Calculator](https://via.placeholder.com/800x600/f9fafb/1f2937?text=Light+Mode+Calculator)

### Mobile Experience
![Mobile View](https://via.placeholder.com/400x800/1e293b/cbd5e1?text=Mobile+Responsive)

## 🚀 Getting Started

### Quick Start
1. **Visit**: [https://kareemschultz.github.io/guyana-salary-calculator/](https://kareemschultz.github.io/guyana-salary-calculator/)
2. **Enter**: Your employment details and salary information
3. **Calculate**: Get instant, accurate results based on 2025 tax regulations

### Local Development
```bash
# Clone the repository
git clone https://github.com/kareemschultz/guyana-salary-calculator.git

# Navigate to the project directory
cd guyana-salary-calculator

# Open index.html in your browser
# No build process required - it's a pure client-side application
```

## 📋 Usage Guide

### Basic Calculation
1. **Personal Information**: Enter your name, position, and employment dates
2. **Payment Frequency**: Select how often you're paid (daily to yearly)
3. **Basic Salary**: Enter your base salary amount
4. **Allowances**: Add both taxable and non-taxable allowances
5. **Qualifications**: Select any applicable degree qualifications
6. **Deductions**: Include children, insurance, and loan information
7. **Calculate**: View your comprehensive salary breakdown

### Advanced Features

#### **Salary Increase Simulator**
- Model percentage-based salary increases
- Choose between taxable and non-taxable increases
- Calculate retroactive payments for multiple months
- See impact on monthly take-home, gratuity, and annual income

#### **Position Presets**
Pre-configured positions with standard allowances:
- ICT Technician I, II, III
- Assistant ICT Engineer III
- ICT Engineer III

#### **Payment Frequencies**
All calculations automatically adjust for:
- **Daily**: 260 working days per year
- **Weekly**: 52 payments per year
- **Fortnightly**: 26 payments per year
- **Monthly**: 12 payments per year
- **Yearly**: Single annual payment

## 🏗️ Technical Architecture

### **Frontend Technologies**
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with CSS custom properties and grid/flexbox
- **JavaScript ES6+**: Modular architecture with separated concerns
- **Bootstrap 5**: Responsive framework with custom theme integration
- **Chart.js**: Interactive data visualizations
- **Font Awesome**: Comprehensive icon library

### **File Structure**
```
guyana-salary-calculator/
├── index.html              # Main application file
├── css/
│   └── styles.css          # Comprehensive styling with dark mode
├── js/
│   ├── constants.js        # Tax rates, allowances, and frequency configs
│   ├── utils.js           # Utility functions and theme management
│   ├── calculator.js      # Core calculation engine
│   ├── ui-handlers.js     # DOM manipulation and event handling
│   ├── salary-increase.js # Salary increase simulation logic
│   ├── charts.js          # Chart generation and management
│   └── main.js            # Application initialization
├── README.md              # This documentation
└── LICENSE               # MIT License
```

### **Key Technical Features**
- **Client-side Only**: No server required, works entirely in the browser
- **Progressive Enhancement**: Works without JavaScript for basic functionality
- **Local Storage**: Theme preferences persisted across sessions
- **Modular Design**: Separated JavaScript modules for maintainability
- **Performance Optimized**: Minimal dependencies, fast loading

## 📊 Calculation Details

### **Tax Calculation Method**
1. **Gross Income**: Basic salary + taxable allowances + additional income
2. **Deductions Applied**: Personal allowance, NIS, child allowances, insurance
3. **Taxable Income**: Gross income minus all applicable deductions
4. **Tax Calculation**: 25% up to $260,000, then 35% on the remainder
5. **Net Salary**: Gross income minus NIS, tax, and other deductions

### **Gratuity Calculation**
- **Accrual Rate**: 22.5% of basic salary per month
- **Payment Schedule**: Typically every 6 months
- **Tax Status**: Non-taxable income
- **Annual Total**: Usually equals 2.7 months of basic salary (22.5% × 12 months)

### **Frequency Adjustments**
All tax thresholds, allowances, and deductions are automatically converted based on payment frequency:
- **Personal Allowance**: $130,000 monthly → $30,000 weekly → $4,274 daily
- **Tax Thresholds**: Proportionally adjusted for each frequency
- **NIS Ceilings**: Scaled appropriately for payment periods

## 🔧 Customization

### **Adding New Position Presets**
Edit `js/constants.js` to add new positions:
```javascript
const POSITION_PRESETS = {
    'your-position-id': {
        title: 'Your Position Title',
        baseSalary: 250000,
        taxableAllowances: { /* ... */ },
        nonTaxableAllowances: { /* ... */ }
    }
};
```

### **Modifying Tax Rates**
Update tax constants in `js/constants.js`:
```javascript
const TAX_RATE_1 = 0.25; // 25%
const TAX_RATE_2 = 0.35; // 35%
const TAX_THRESHOLD = 260000; // Monthly threshold
```

### **Theme Customization**
Modify CSS custom properties in `css/styles.css`:
```css
:root {
    --primary: #1e40af;
    --background: #f9fafb;
    /* ... other variables */
}
```

## 📈 Charts and Visualizations

The calculator includes four interactive charts:

1. **Income Breakdown**: Pie chart showing salary components
2. **Tax Bracket Analysis**: Bar chart comparing tax obligations
3. **Annual Cash Flow**: Line chart showing monthly income with gratuity spikes
4. **Net vs. Gross**: Comparison chart for different payment periods

All charts automatically adapt to the current theme and update in real-time.

## 🔒 Privacy and Security

- **No Data Collection**: All calculations performed locally in your browser
- **No Server Communication**: Complete client-side application
- **No Personal Data Storage**: Only theme preferences saved locally
- **Open Source**: Full transparency with public source code

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### **Types of Contributions**
- 🐛 **Bug Reports**: Found an issue? Let us know!
- 💡 **Feature Requests**: Have an idea? We'd love to hear it!
- 📝 **Documentation**: Help improve our docs
- 🔧 **Code Contributions**: Submit pull requests

### **Development Process**
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Contribution Guidelines**
- Follow existing code style and conventions
- Add comments for complex logic
- Test across different browsers and devices
- Update documentation for new features

## 📅 Changelog

### **Version 2.0.0** *(Current - 2025 Fiscal Year)*
- ✨ **NEW**: Payment frequency support (daily to yearly)
- ✨ **NEW**: 2025 qualification allowances (ACCA, Master's, PhD)
- ✨ **NEW**: Dark mode as default with enhanced styling
- ✨ **NEW**: Salary increase simulator with retroactive calculations
- 🔄 **UPDATED**: Tax rates (25%/35% vs previous 28%/40%)
- 🔄 **UPDATED**: Personal allowance increased to $130,000
- 🔄 **UPDATED**: Modern UI with improved accessibility
- 🔄 **UPDATED**: Enhanced mobile experience
- 🔄 **UPDATED**: Comprehensive chart visualizations

### **Version 1.0.0** *(Initial Release)*
- 🎉 Basic salary and gratuity calculations
- 📊 Tax bracket analysis
- 🏢 Position presets for ICT roles
- 📱 Responsive design
- 🎨 Light theme interface

## 🆘 Support and FAQ

### **Common Questions**

**Q: How accurate are the calculations?**
A: The calculator uses official 2025 Guyana tax regulations and is regularly updated. However, always consult a tax professional for official advice.

**Q: Can I use this for previous tax years?**
A: This calculator is specifically designed for 2025 tax regulations. Tax rates and allowances differ for previous years.

**Q: Does it work offline?**
A: Yes! Once loaded, the calculator works completely offline.

**Q: Can I save my calculations?**
A: Currently, calculations are not saved between sessions. We recommend taking screenshots or notes of important results.

### **Getting Help**
- 📧 **Issues**: [GitHub Issues](https://github.com/kareemschultz/guyana-salary-calculator/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/kareemschultz/guyana-salary-calculator/discussions)
- 🐛 **Bug Reports**: Use our issue template for fastest response

## 📄 Legal and Compliance

### **Disclaimer**
This calculator is designed to provide estimates based on 2025 Guyana tax regulations. While every effort has been made to ensure accuracy, please consult with a qualified tax professional for official advice regarding your specific situation. The developers are not responsible for any financial decisions made based on these calculations.

### **Data Sources**
- Guyana Revenue Authority (GRA) 2025 tax guidelines
- National Insurance Scheme (NIS) contribution rates
- Official government announcements regarding qualification allowances
- Standard Assuria insurance premium rates

### **License**
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

### **Upcoming Features**
- 💾 **Save/Load Calculations**: Ability to save and reload calculation scenarios
- 📊 **Comparison Mode**: Side-by-side comparison of different salary scenarios
- 📱 **Progressive Web App**: Install as a mobile app
- 🔄 **Auto-Update**: Automatic updates when tax regulations change
- 🌍 **Multi-Language**: Support for additional languages
- 📈 **Historical Analysis**: Track salary changes over time
- 🔗 **API Integration**: Real-time exchange rates and economic indicators

### **Long-term Goals**
- Integration with other Caribbean tax systems
- Advanced financial planning tools
- Business payroll calculation features
- Tax optimization recommendations

## 👨‍💻 Author

**Kareem Schultz**
- 🌐 **Website**: [Portfolio Coming Soon]
- 💼 **LinkedIn**: [Connect with Kareem]
- 📧 **Email**: [Contact for collaborations]
- 🐦 **Twitter**: [@kareemschultz]

## 🙏 Acknowledgments

- **Guyana Revenue Authority** for comprehensive tax documentation
- **Government of Guyana** for the 2025 fiscal policy updates
- **Open Source Community** for the excellent tools and libraries
- **Guyanese Workforce** for feedback and feature requests
- **Beta Testers** who helped refine the user experience

## 💝 Support the Project

If this calculator has helped you, consider:
- ⭐ **Starring** the repository
- 🐛 **Reporting** bugs or issues
- 💡 **Suggesting** new features
- 🔄 **Sharing** with colleagues and friends
- 🤝 **Contributing** code or documentation

---

<div align="center">

**Built with ❤️ for the Guyanese workforce**

🇬🇾 **Making tax calculations simple and accessible** 🇬🇾

[**Try the Calculator**](https://kareemschultz.github.io/guyana-salary-calculator/) | [**Report Issues**](https://github.com/kareemschultz/guyana-salary-calculator/issues) | [**Contribute**](https://github.com/kareemschultz/guyana-salary-calculator/pulls)

</div>
