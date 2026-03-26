import { 
  FileSpreadsheet, 
  Database, 
  FileText, 
  FileCode, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Clock,
  Mail,
  Phone,
  MessageSquare,
  ExternalLink,
  Download,
  Eye,
  Filter,
  Search,
  Plus
} from 'lucide-react';

export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'Excel' | 'Data Cleaning' | 'Conversions' | 'Other' | 'Data Extraction' | 'Data Processing';
  tags: string[];
  files: ProjectFile[];
  thumbnail: string;
}

export interface ProjectFile {
  name: string;
  type: 'excel' | 'word' | 'pdf' | 'image' | 'video';
  url: string;
  size?: string;
}

export interface Service {
  title: string;
  description: string;
  icon: any;
  imageUrl?: string;
}

export const SERVICES: Service[] = [
  {
    title: "Data Entry",
    description: "Fast and accurate data entry services for businesses of all sizes, ensuring data integrity.",
    icon: Plus,
  },
  {
    title: "Data Cleaning",
    description: "Removing duplicates, fixing errors, and standardizing formats for clean, reliable data.",
    icon: Database,
  },
  {
    title: "Data Formatting",
    description: "Professional Excel and Google Sheets formatting to make your data visually appealing and easy to read.",
    icon: FileSpreadsheet,
  },
  {
    title: "Data Extraction",
    description: "Extracting valuable information from various sources and converting it into structured, analysis-ready formats.",
    icon: FileText,
  },
  {
    title: "Data Processing",
    description: "Cleaning, organizing, and transforming raw data into a structured format for analysis.",
    icon: Zap,
  },
  {
    title: "Data Organization",
    description: "Structuring raw data into logical hierarchies and categories for better management.",
    icon: CheckCircle2,
  }
];

export const HIGHLIGHTS = [
  { title: "Advanced Excel", icon: FileSpreadsheet },
  { title: "Data Cleaning", icon: Database },
  { title: "Fast Delivery", icon: Clock },
  { title: "High Accuracy", icon: ShieldCheck },
];

export const STATS = [
  { label: "Projects Completed", value: "250+" },
  { label: "Files Processed", value: "1,500+" },
  { label: "Accuracy Rate", value: "99.9%" },
  { label: "Happy Clients", value: "120+" },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Insurance and Sales Data',
    description: 'Project focuses on the use of conditional formatting to organise data through dynamic colour coding and automated highlighting visually. It improves readability and allows key information to stand out instantly for quick analysis.',
    category: 'Excel',
    tags: ['Data Formatting', 'Conditional Formatting'],
    thumbnail: 'https://i.ibb.co/Wp6pcztc/jk.jpg',
    files: [
      {
        name: '188 Insurance & Sales Data.xlsx',
        type: 'excel',
        url: "https://1drv.ms/x/c/3b764e46c402ce7d/IQQzPMHgnTnmS6Cw_OGzD5Y6AUN8Bgx9gLrnpXxZYl5J7l0?em=2&AllowTyping=True&ActiveCell='Insurance%20Data'!I5&wdInConfigurator=True&wdInConfigurator=True&edaebf=rslc0",
        size: 'Live Embed'
      }
    ]
  },
  {
    id: '2',
    title: 'Investment Data Transformation and Pivot Analysis',
    description: 'This project involves converting a 37-page PDF into a structured Excel dataset and using pivot tables for quick data analysis and summarisation, ensuring accuracy and meaningful insights.',
    category: 'Data Extraction',
    tags: ['Data Extraction', 'Data Conversion', 'Data Transformation'],
    thumbnail: 'https://i.ibb.co/jPgkMJ02/jk.webp',
    files: [
      {
        name: 'Original_Statement.pdf',
        type: 'pdf',
        url: 'https://1drv.ms/b/c/3b764e46c402ce7d/IQRsqAqn3oqlT6iunQqAPL5-AXv08aoIPb7aLs_HJdsUVFA?em=2&wdEmbedCode=0&wdPrint=0&wdStartOn=1',
        size: 'Live Embed'
      },
      {
        name: 'Converted_Data.xlsx',
        type: 'excel',
        url: "https://1drv.ms/x/c/3b764e46c402ce7d/IQRK2-9O_IWUR6MoKp8eQaikAS_bOn0ne_4ON9gj2f5Qk-c?em=2&ActiveCell='Table%201'!F1&wdInConfigurator=True&wdInConfigurator=True&edaebf=rslc0",
        size: 'Live Embed'
      }
    ]
  },
  {
    id: '3',
    title: 'Sales Data Conversion',
    description: 'This project involves converting PDF data into a clean and structured Excel dataset and creating charts to visually represent the data for clear insights and easy analysis.',
    category: 'Data Extraction',
    tags: ['Data Extraction', 'Data Conversion', 'PDF to Excel'],
    thumbnail: 'https://i.ibb.co/LXmV11sR/jk.jpg',
    files: [
      {
        name: 'Original_Statement.pdf',
        type: 'pdf',
        url: 'https://1drv.ms/b/c/3b764e46c402ce7d/IQQNP6nKcTpzR4VPoGvjvU-AASgF1IWmFV3ZV1U14nUYWmw',
        size: 'Live Embed'
      },
      {
        name: 'Converted_Data.xlsx',
        type: 'excel',
        url: "https://1drv.ms/x/c/3b764e46c402ce7d/IQTtcTorGPYPT4w5PdnhPqGcATikRYp4WVVLj837_WSApNI?em=2&wdAllowInteractivity=False&ActiveCell='Table%201'!H5&wdInConfigurator=True&wdInConfigurator=True&edaebf=rslc0",
        size: 'Live Embed'
      }
    ]
  },
  {
    id: '4',
    title: 'Customer Invoice Data Processing',
    description: 'This project focuses on data processing, including cleaning, organizing, and transforming raw data into a structured format, ensuring accuracy, consistency, and readiness for analysis.',
    category: 'Data Cleaning',
    tags: ['Data Processing'],
    thumbnail: 'https://i.ibb.co/x8gbV23W/jk.jpg',
    files: [
      {
        name: 'Customer Invoicing Data',
        type: 'excel',
        url: "https://1drv.ms/x/c/3b764e46c402ce7d/IQTgfSDSAZKeQZQFZp1P4szsAafqmQKP2yjdv9K_XXRa8-M?em=2&AllowTyping=True&ActiveCell='Customer%20Invoicing%20Data'!M8&wdInConfigurator=True&wdInConfigurator=True&edaebf=rslc0",
        size: 'Live Embed'
      }
    ]
  },
  {
    id: '5',
    title: 'Conditional Calculation Dashboard',
    description: 'This project features six independent sheets within a single Excel file, each performing conditional calculations using various formulas and data processing techniques. It highlights the ability to handle diverse datasets and apply logic-driven solutions for accurate and efficient results.',
    category: 'Data Processing',
    tags: ['Data Processing'],
    thumbnail: 'https://i.ibb.co/tpR4PYS4/j.jpg',
    files: [
      {
        name: 'Conditional Calculation',
        type: 'excel',
        url: "https://1drv.ms/x/c/3b764e46c402ce7d/IQQJ7KKU7rD0TqhS0XMA0-wNAePKzoVOole_A8BbY108YG4?em=2&wdAllowInteractivity=False&AllowTyping=True&ActiveCell='Sheet%201'!B21&wdInConfigurator=True&wdInConfigurator=True&edaebf=rslc0",
        size: 'Live Embed'
      }
    ]
  }
];
