import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldAlt,
  faMapMarkerAlt,
  faCheckCircle,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import SafePinMapLogo from '@assets/SafePin Map Logo.png';

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <img
              src={SafePinMapLogo}
              alt="SafePin Map Logo"
              className="w-32 h-32 mx-auto mb-8 rounded-lg shadow-lg"
            />
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Creating Safer Communities
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              SafePin empowers citizens to anonymously report incidents and stay informed
              about safety concerns in your community.
            </p>
            <div className="space-y-4">
              <Link
                to="/report"
                className="inline-block bg-green-600 text-white px-8 py-4 rounded-md text-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Report Incident
              </Link>
              <div>
                <Link
                  to="/verify"
                  className="inline-block text-green-600 hover:text-green-700 transition-colors"
                >
                  Check Existing Report Status
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Report</h3>
                <p className="text-gray-600">
                  Citizens submit anonymous reports through the SafePin platform.
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Verify</h3>
                <p className="text-gray-600">
                  Submitted reports are verified by our dedicated team for authenticity.
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Inform</h3>
                <p className="text-gray-600">
                  Verified incidents are plotted on the map and alerts are sent to relevant users.
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold">4</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Act</h3>
                <p className="text-gray-600">
                  Authorities are notified to take appropriate action based on the reports.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About SafePin Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="w-32 h-32 bg-green-600 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faShieldAlt} className="h-16 w-16 text-white" />
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">About SafePin</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                SafePin is a community-driven safety platform designed to bridge the gap
                between citizens and authorities. By enabling anonymous reporting and
                information sharing, we aim to create a safer environment where sensitive
                information reaches the right people while keeping communities informed
                about critical safety concerns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            SafePin Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="h-8 w-8 text-green-600 mb-4"
              />
              <div className="text-3xl font-bold text-gray-900 mb-2">1,738</div>
              <div className="text-gray-600">Total Reports</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <FontAwesomeIcon
                icon={faUsers}
                className="h-8 w-8 text-green-600 mb-4"
              />
              <div className="text-3xl font-bold text-gray-900 mb-2">47</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <FontAwesomeIcon
                icon={faShieldAlt}
                className="h-8 w-8 text-green-600 mb-4"
              />
              <div className="text-3xl font-bold text-gray-900 mb-2">279</div>
              <div className="text-gray-600">Total Incidents</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="h-8 w-8 text-green-600 mb-4"
              />
              <div className="text-3xl font-bold text-gray-900 mb-2">9</div>
              <div className="text-gray-600">Participating Authorities</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Alerts Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Recent Alerts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src="https://od2-image-api.abs-cbn.com/prod/20250613130620/5babc293462ef2bee1831a07fa07bdd858c85184c1c0ac7dc139131757ecb32a.jpg"
                alt="Motorcycle crash"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  3 sugatan sa banggaan ng 2 motorsiklo sa QC
                </h3>
                <p className="text-gray-600 mb-4">
                  Tatlo ang sugatan sa banggaan ng dalawang motorsiklo sa Quezon City...
                </p>
                <a
                  href="https://www.abs-cbn.com/news/nation/2025/6/13/tv-patrol-3-sugatan-sa-banggaan-ng-2-motorsiklo-sa-qc-2022"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 transition-colors"
                >
                  Read More →
                </a>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src="https://od2-image-api.abs-cbn.com/prod/20250613010640/99bc67940a8ae9a983e6b9714c1696ea46279812c2485cb1a7b5d8a298a41a06.jpg"
                alt="Arrest in Manila"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Lalaking naaresto sa pagsusugal, nahulihan ng baril
                </h3>
                <p className="text-gray-600 mb-4">
                  Arestado ang 25-anyos na lalaki matapos mahuling nagsusugal...
                </p>
                <a
                  href="https://www.abs-cbn.com/news/nation/2025/6/13/lalaking-naaresto-sa-pagsusugal-nahulihan-ng-baril-nang-kapkapan-ng-pulis-1252"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 transition-colors"
                >
                  Read More →
                </a>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src="https://od2-image-api.abs-cbn.com/prod/20250611140636/65ca9f803a900067dbc9564bf0e0c4625e60ebe9ace494916cd8183f704b94ff.jpg"
                alt="Drug seizure"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Higit 1 toneladang shabu na nakuha sa dagat
                </h3>
                <p className="text-gray-600 mb-4">
                  Ibinunyag ng Philippine Drug Enforcement Agency na konektado...
                </p>
                <a
                  href="https://www.abs-cbn.com/news/nation/2025/6/11/tv-patrol-higit-1-toneladang-shabu-na-nakuha-sa-dagat-galing-sa-sam-gor-syndicate-pdea-2139"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 transition-colors"
                >
                  Read More →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home; 