interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Comment ça marche ?
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6 space-y-6">
          {/* Vidéo placeholder */}
          <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-gray-500">Vidéo tutorielle à venir</p>
              <p className="text-sm text-gray-400">Intégrez votre vidéo YouTube ou locale ici</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Guide d'utilisation rapide
            </h3>

            <div className="space-y-3">
              {/* Étape 1 */}
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Ouvrez l'application</h4>
                  <p className="text-sm text-gray-600">
                    Le calendrier affiche le mois en cours avec vos événements.
                  </p>
                </div>
              </div>

              {/* Étape 2 */}
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Dictez votre rendez-vous</h4>
                  <p className="text-sm text-gray-600">
                    Cliquez sur le microphone et parlez. Exemple : "Dentiste mardi 15h"
                  </p>
                </div>
              </div>

              {/* Étape 3 */}
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">L'application comprend</h4>
                  <p className="text-sm text-gray-600">
                    Elle identifie automatiquement la catégorie (ex: "Dentiste" → Santé) et lui attribue une couleur.
                  </p>
                </div>
              </div>

              {/* Étape 4 */}
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Visualisez votre journée</h4>
                  <p className="text-sm text-gray-600">
                    Chaque événement apparaît avec sa couleur. Maximum 10 événements par jour.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Exemples de commandes vocales */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-800 mb-3">
              Exemples de commandes vocales
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>"Médecin demain à 10h"</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>"Courses samedi matin"</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>"Réunion de travail lundi 14h"</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span>"Dentiste le 15 janvier à 9h30"</span>
              </li>
            </ul>
          </div>

          {/* Limite */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h4 className="font-semibold text-yellow-800">Limite quotidienne</h4>
                <p className="text-sm text-yellow-700">
                  Vous pouvez ajouter jusqu'à 10 événements par jour pour garder votre agenda lisible et organisé.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors"
          >
            J'ai compris !
          </button>
        </div>
      </div>
    </div>
  );
}
