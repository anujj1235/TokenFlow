// =====================================================
// CHECK LOGIN
// =====================================================

const requireLogin = (req, res, next) => {

    if (!req.session || !req.session.user) {

        return res.status(401).json({

            success: false,

            message: "Authentication required. Please login."

        });

    }

    next();

};



// =====================================================
// CHECK ADMIN
// =====================================================

const requireAdmin = (req, res, next) => {

    if (!req.session || !req.session.user) {

        return res.status(401).json({

            success: false,

            message: "Authentication required. Please login."

        });

    }


    if (req.session.user.role !== "admin") {

        return res.status(403).json({

            success: false,

            message: "Admin access required."

        });

    }


    next();

};



module.exports = {

    requireLogin,
    requireAdmin

};